import type { NodeExecutor } from "@/features/executions/lib/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from 'handlebars';
import { httpRequestChannel } from "@/inngest/channels/http-request";


Handlebars.registerHelper('json', (context) => {
    const stringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(stringified);
});

type HttpRequestData = {
    variableName: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
    body?: string;
}

export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step, publish }) => {

    await publish(httpRequestChannel().status({
        nodeId,
        status: "loading"
    }));

    if (!data.endpoint) {
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("Endpoint is required");
    }

    if (!data.variableName) {
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error"
        }));
        throw new NonRetriableError("Variable name is required");
    }

    if (!data.method) {
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error"
        }));
        throw new NonRetriableError("Method is required");
    }

    try {
        const result = await step.run("https-trigger", async () => {
            const endpoint = Handlebars.compile(data.endpoint || "{}")(context);
            const method = data.method || 'GET';

            const options: KyOptions = {
                method
            }
            if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
                const resolved = Handlebars.compile(data.body || {})(context);
                JSON.parse(resolved);
                options.body = resolved;
                options.headers = {
                    'Content-Type': 'application/json',
                }
            }

            const response = await ky(endpoint!, options);
            const contentType = response.headers.get('content-type');
            let responseData = null;
            if (contentType?.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            const responsePayload = {
                httpResponse: {
                    status: response.status,
                    data: responseData,
                    statusText: response.statusText,
                },
            }

            return {
                httpResponse: {
                    status: response.status,
                    data: responseData,
                    statusText: response.statusText,
                },
                ...context,
                [data.variableName]: responsePayload,

            }


        });
        await publish(httpRequestChannel().status({
            nodeId,
            status: "success"
        }));
        return result;
    } catch (error) {
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error"
        }));
        throw error;
    }
}