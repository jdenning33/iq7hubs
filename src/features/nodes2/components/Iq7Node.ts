import { Iq7Agent } from './Iq7Agent';
import { Iq7NodeMeta, Iq7NodeStatus, JobRequest } from './types';
import { Iq7Shaker } from './Iq7Shaker';

/**
 * Represents a job in the system.
 * Jobs have meta
 */
export class Iq7Node {
    // persistent data
    data: Iq7NodeMeta;

    // transient data
    agent: Iq7Agent;
    supervisor?: Iq7Node;
    subNodes: Iq7Node[] = [];
    shaker: Iq7Shaker;

    // constructor
    constructor(type: Iq7Agent, data: Iq7NodeMeta, shaker: Iq7Shaker) {
        this.agent = type;
        this.data = data;
        this.shaker = shaker;
        this.persist(data);
    }

    // update our node data and persist it
    persist(data: Iq7NodeMeta) {
        this.data = data;
        this.shaker.persist(data);
    }

    // update our status and deliverable
    updateNodeStatus(status: Iq7NodeStatus, deliverable?: string) {
        this.persist({
            ...this.data,
            status,
            deliverable: deliverable || this.data.deliverable,
        });
    }

    deliverAttempt = 1;
    // shake the node, encouraging it to deliver on its objective
    active: Date | null = null;
    async shake() {
        // if it's been less more than 30 seconds assume we failed and shake again
        if (this.active && new Date().getTime() - this.active.getTime() < 30000)
            return;
        console.log(
            'Actually shaking node',
            this.data.id,
            this.data.status,
            this.subNodes
        );
        this.active = new Date();
        await this.shakeHelper();
        this.active = null;
    }
    async shakeHelper() {
        if (this.data.status === 'done') return;
        // if we're not done with subnodes, we're waiting
        if (!this.areSubNodesDone()) {
            let firstUnfinishedNode = this.subNodes.find(
                (n) => n.data.status !== 'done'
            );
            if (firstUnfinishedNode) firstUnfinishedNode.shake();
            return this.updateNodeStatus('waiting');
        }

        try {
            // if we're not done, we're working
            this.updateNodeStatus('working');
            console.log(
                'WORKING',
                this.data.id,
                this.data.status,
                this.deliverAttempt
            );
            // try to deliver
            let response = await this.agent.tryToDeliver({
                supervisorContext: this.getContext(),
                subNodeContext: this.getSubNodeContext(),
                objective: this.data.objective,
                numberOfAttempts: this.deliverAttempt,
            });
            this.deliverAttempt++;

            // if we have subnodes to handle, do that
            if (response.jobRequests.length > 0) {
                this.updateNodeStatus('waiting');
                return this.handleNewJobRequests(response.jobRequests);
            }

            // if we have a deliverable, we're done
            if (response.deliverable) {
                this.updateNodeStatus('done', response.deliverable);
                //this.supervisor?.shake();
                return;
            }
        } catch (e) {
            console.error('Error shaking node', e);
            this.persist({ ...this.data, status: 'failed' });
        }
    }

    // are all subnodes done?
    areSubNodesDone() {
        return this.subNodes.every((n) => n.data.status === 'done');
    }

    getContext(): string {
        return (
            (this.supervisor?.getContext() ||
                this.getObjectiveAndDeliverable() ||
                '') +
            '\n\n' +
            this.getSubNodeContext()
        );
    }
    getSubNodeContext() {
        return (
            this.subNodes
                .map((sn) => sn.getObjectiveAndDeliverable())
                .join('\n\n') || ''
        );
    }
    getObjectiveAndDeliverable() {
        return [this.data.objective, this.data.deliverable || 'TBD'].join('\n');
    }

    // build, track and shake our subnodes
    async handleNewJobRequests(subNodeRequests: JobRequest[]) {
        let newSubNodes = this.shaker.buildSubNodes(
            subNodeRequests,
            this.data.agentName,
            this.data.id
        );
        this.subNodes.push(...newSubNodes);
        for (let node of newSubNodes) {
            node.supervisor = this;
            // await node.shake();
        }
    }
}
