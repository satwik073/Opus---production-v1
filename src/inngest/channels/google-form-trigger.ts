import { channel, topic } from "@inngest/realtime";


export const GOOGLE_FORM_TRIGGER_CHANNEL = "google-form-trigger-executions";

export const googleFormTriggerChannel = channel(GOOGLE_FORM_TRIGGER_CHANNEL).addTopic(
    topic("status").type<{
        nodeId: string;
        status: "loading" | "success" | "error";

    }>(),
)