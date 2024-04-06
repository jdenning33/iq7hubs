import { Iq7NodeMeta, JobRequest } from '../utils/Core/types';
import { Iq7Shaker } from '../components/Iq7Shaker';
import { agents } from '../utils/Agents/agents';
import { buildNodeMetaFromJobRequest } from '../utils/buildNodeMetaFromJobRequest';
import { shakeNode } from '../utils/shakeNode';
import { findFirstUnfinishedChild } from '../utils/findFirstUnfinishedChild';
import { buildNodeHierarchy } from '../utils/buildNodeHierarchy';
import { useIq7NodeStore } from './useIq7NodeStore';
import { useEffect } from 'react';

export function useIq7Nodes(shakerId: string) {
    const store = useIq7NodeStore();

    let baseNodes = store.nodes.filter((n) => !n.supervisorId);
    let nodeHierarchy = baseNodes.map((n) =>
        buildNodeHierarchy(n, store.nodes)
    );

    // useEffect(() => {
    //     if (store.nodes.length > 0) shake();
    // }, [store.nodes.length]);

    const handleNewJobRequest = (
        jobRequest: JobRequest,
        supervisor?: Iq7NodeMeta
    ) => {
        let nn = buildNodeMetaFromJobRequest(jobRequest, agents, supervisor);
        nn.shakerId = shakerId;
        console.log('New node:', nn, supervisor);
        nn = store.addNode(nn);
        return nn;
    };

    const shake = (id?: string) => {
        let nodeToShake: Iq7NodeMeta | undefined | null;
        if (id) {
            nodeToShake = store.nodes.find((n) => n.id === id);
        } else nodeToShake = findFirstUnfinishedChild(null, store.nodes);
        if (nodeToShake) {
            console.log('Shaking node:', nodeToShake);
            shakeNode(
                nodeToShake,
                agents,
                store.nodes,
                store.updateNode,
                handleNewJobRequest
            );
        }
    };

    return {
        ...store,
        nodes: store.nodes.filter((n) => n.shakerId === shakerId),
        nodeHierarchies: nodeHierarchy,
        handleNewJobRequest,
        shake,
    };
}
