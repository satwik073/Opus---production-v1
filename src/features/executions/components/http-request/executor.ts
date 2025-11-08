import type { NodeExecutor } from "@/features/executions/lib/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
    body?: string;
}

export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step }) => {

    if ( !data.endpoint ) {
        throw new NonRetriableError("Endpoint is required");
    }

    const result = await step.run("https-trigger", async () => {
        const endpoint = data.endpoint;
        const method = data.method || 'GET';

        const options : KyOptions = {
            method
        }
        if ( method === 'POST' || method === 'PUT' || method === 'PATCH' ) {
            if ( data.body ) {
                options.body = data.body;
            }
        }

        const response = await ky(endpoint!, options);
        const contentType = response.headers.get('content-type');
        let responseData = null;
        if ( contentType?.includes('application/json') ) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }
        return {
           ...context,
           httpResponse: {
               status: response.status,
               data: responseData,
               statusText: response.statusText,
           },
        }
    });
    return result;
}