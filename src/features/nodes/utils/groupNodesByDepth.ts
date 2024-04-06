import { Iq7NodeMeta } from './Core/types';

export type NodeWithLineage = Iq7NodeMeta & { lineage: string[] };
export const groupNodesByDepth = (nodes: Iq7NodeMeta[]) => {
    const rootUnits = nodes.filter((node) => !node.supervisorId);

    const childrenByDepth: NodeWithLineage[][] = [];
    const addChildrenAndDepth = (
        node: Iq7NodeMeta | NodeWithLineage,
        parent: NodeWithLineage | null,
        depth = 0
    ) => {
        childrenByDepth[depth] = childrenByDepth[depth] || [];
        const nodeWithLineage = {
            ...node,
            lineage: parent ? [...parent.lineage, parent.id] : [],
        };
        childrenByDepth[depth].push(nodeWithLineage);
        const children = nodes.filter((n) => n.supervisorId === node.id);
        children.forEach((child) =>
            addChildrenAndDepth(child, nodeWithLineage, depth + 1)
        );
    };
    rootUnits.forEach((child) => addChildrenAndDepth(child, null, 0));
    return childrenByDepth;
};
