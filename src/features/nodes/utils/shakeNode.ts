import { Iq7NodeMeta, JobRequest } from './Core/types';
import { AgentMap } from './Core/types';

export async function shakeNode(
    node: Iq7NodeMeta,
    agents: AgentMap,
    allNodes: Iq7NodeMeta[],
    updateNode: (node: Partial<Iq7NodeMeta>) => void,
    handleNewJobRequest: (jobRequest: JobRequest, node: Iq7NodeMeta) => void
) {
    console.log('Shaking node:', node);

    if (node.status === 'working') {
        return;
    }
    if (node.deliverAttempt > 3) {
        return updateNode({
            id: node.id,
            deliverable: 'Could not complete objective.',
            status: 'done',
        });
    }

    // if we're not done with subnodes, we're waiting
    if (!areSubNodesDone(node, allNodes)) {
        return updateNode({ id: node.id, status: 'waiting' });
    }

    try {
        // if we're not done, we're working
        updateNode({
            id: node.id,
            status: 'working',
            deliverAttempt: node.deliverAttempt + 1,
        });
        console.log('WORKING', node.id, node.deliverAttempt);
        // try to deliver
        let agent = agents[node.agentName];
        let response = await agent.tryToDeliver({
            supervisorContext: getContext(node, allNodes),
            subNodeContext: getSubNodeContext(node, allNodes),
            objective: node.objective,
            numberOfAttempts: node.deliverAttempt,
        });
        console.log('DONE', node.id, node.deliverAttempt, response);

        // if we have subnodes to handle, do that
        if (response.jobRequests.length > 0) {
            updateNode({ id: node.id, status: 'waiting' });
            return response.jobRequests.forEach((jr) =>
                handleNewJobRequest(jr, node)
            );
        }

        // if we have a deliverable, we're done
        if (response.deliverable) {
            return updateNode({
                id: node.id,
                status: 'done',
                deliverable: response.deliverable,
            });
        }
        throw new Error('No deliverable or action returned...');
    } catch (e) {
        console.error('Error shaking node', e);
        updateNode({ id: node.id, status: 'failed' });
    }
}
// are all subnodes done?
function areSubNodesDone(node: Iq7NodeMeta, allNodes: Iq7NodeMeta[]) {
    let subNodes = allNodes.filter((n) => n.supervisorId === node.id);
    return subNodes.every((n) => n.status === 'done');
}
function getContext(
    node: Iq7NodeMeta | undefined,
    allNodes: Iq7NodeMeta[]
): string {
    if (!node) return '';
    let supervisor = allNodes.find((n) => n.id === node.supervisorId);
    return (
        (getContext(supervisor, allNodes) || getObjectiveAndDeliverable(node)) +
        '\n\n' +
        getSubNodeContext(node, allNodes)
    );
}
function getSubNodeContext(node: Iq7NodeMeta, allNodes: Iq7NodeMeta[]): string {
    let subNodes = allNodes.filter((n) => n.supervisorId === node.id);
    return (
        subNodes.map((sn) => getObjectiveAndDeliverable(sn)).join('\n\n') || ''
    );
}
function getObjectiveAndDeliverable(node: Iq7NodeMeta) {
    return [node.objective, node.deliverable || 'TBD'].join('\n');
}
