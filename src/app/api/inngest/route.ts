import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { execute_ai_method } from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    execute_ai_method
  ],
});