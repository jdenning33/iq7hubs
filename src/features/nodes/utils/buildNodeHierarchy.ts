import { Iq7NodeMeta } from './Core/types';

export type NodeHierarchy = {
    node: Iq7NodeMeta;
    subNodes: NodeHierarchy[];
};
//recursively build a hierarchy of nodes
export function buildNodeHierarchy(
    node: Iq7NodeMeta,
    allNodes: Iq7NodeMeta[]
): NodeHierarchy {
    let subNodes = allNodes
        .filter((n) => n.supervisorId === node.id)
        .map((n) => buildNodeHierarchy(n, allNodes));
    return { node, subNodes };
}
