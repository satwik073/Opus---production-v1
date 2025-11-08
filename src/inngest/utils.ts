import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";


export const topologicalSort = (nodes: Node[], connections: Connection[]): Node[] => {
    if (connections.length === 0) {
        return nodes;
    }

    const edges: [string, string][] = connections.map((connection) => [connection.fromNodeId, connection.toNodeId]);

    const connectedNodesIds = new Set<string>();
    for (const connection of connections) {
        connectedNodesIds.add(connection.fromNodeId);
        connectedNodesIds.add(connection.toNodeId);
    }

    for (const node of nodes) {
        if (!connectedNodesIds.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }

    let sortedNodeIds: string[] = [];

    try {
        sortedNodeIds = toposort(edges);
        sortedNodeIds = [...new Set(sortedNodeIds)];
    } catch (error) {
        if (error instanceof Error && error.message.includes("Cyclic")) {
            throw new Error("Cyclic dependency detected");
        }
        throw error;
    }

    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    return sortedNodeIds.map((nodeId) => nodeMap.get(nodeId)!).filter(Boolean);
}