import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch , trpc} from "@/TRPC/Server";

type Input = inferInput<typeof trpc.workflows.getMany>;

export function prefetchWorkflows(input: Input) {
    prefetch(trpc.workflows.getMany.queryOptions(input));
}