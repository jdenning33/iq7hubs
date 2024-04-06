import { Iq7NodeMeta } from './Core/types';

export const findFirstUnfinishedChild = (
    node: Iq7NodeMeta | null,
    allNodes: Iq7NodeMeta[]
): Iq7NodeMeta | null => {
    console.log(node, allNodes);
    let firstUnfinishedChild = allNodes.find(
        (n) => n.supervisorId === node?.id && n.status !== 'done'
    );
    if (firstUnfinishedChild)
        return findFirstUnfinishedChild(firstUnfinishedChild, allNodes);
    return node;
};
