import { sendWorkflowExecutionEvent } from "@/inngest/utils";
import { prisma } from "@/lib/database-setup";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {

        const url = new URL(request.url);
        const workflowId = url.searchParams.get('workflowId');
        if (!workflowId) {
            return NextResponse.json({ error: "Workflow ID is required" }, { status: 400 });
        }

        const body = await request.json();

        const formData = {
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            raw: body
        }
        await sendWorkflowExecutionEvent({
            workflowId,
            initialData: {
                googleForm: formData,
            }
        });


        return NextResponse.json({ message: "Google form webhook received" }, { status: 200 });
    } catch (error) {
        console.error(error, 'Google form error ');
        return NextResponse.json({ error: "Internal Server Error in Google form webhook" }, { status: 500 });
    }
}