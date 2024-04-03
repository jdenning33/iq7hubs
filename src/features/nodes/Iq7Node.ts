import { NodeType } from './NodeType';
import { Iq7NodeData, NodeStatus, SubNodeRequest } from './NodeTypes';
import { Shaker } from './Shaker';

/**
 * Represents a node in the IQ7 system.
 * Nodes can be of different types, and can have subnodes.
 * Nodes can be in different states, and can be shaken to try to deliver on their objective.
 * Nodes can have a shaker, which is used to persist data and build subnodes.
 */
export class Iq7Node {
    // persistent data
    data: Iq7NodeData;

    // transient data
    type: NodeType;
    supervisor?: Iq7Node;
    subNodes: Iq7Node[] = [];
    shaker: Shaker;

    // constructor
    constructor(type: NodeType, data: Iq7NodeData, shaker: Shaker) {
        this.type = type;
        this.data = data;
        this.shaker = shaker;
        this.persist(data);
    }

    // update our node data and persist it
    persist(data: Iq7NodeData) {
        this.data = data;
        console.log('Persisting', data);
        this.shaker.persist(data);
    }

    // update our status and deliverable
    updateNodeStatus(status: NodeStatus, deliverable?: string) {
        this.persist({
            ...this.data,
            status,
            deliverable: deliverable || this.data.deliverable,
        });
    }

    deliverAttempt = 0;
    // shake the node, encouraging it to deliver on its objective
    async shake() {
        // if we're not done with subnodes, we're waiting
        if (!this.areSubNodesDone()) return this.updateNodeStatus('waiting');

        try {
            // if we're not done, we're working
            this.updateNodeStatus('working');
            this.deliverAttempt++;
            // try to deliver
            let response = await this.type.tryToDeliver({
                context: this.buildFullContext(),
                objective: this.data.objective,
                numberOfAttempts: this.deliverAttempt,
            });

            // if we have subnodes to handle, do that
            if (response.subNodeRequests.length > 0) {
                this.updateNodeStatus('waiting');
                return this.handleSubNodeRequests(response.subNodeRequests);
            }

            // if we have a deliverable, we're done
            if (response.deliverable) {
                this.updateNodeStatus('done', response.deliverable);
                this.supervisor?.shake();
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

    // build the full context for this node
    buildFullContext() {
        return (
            this.data.context +
            '\n' +
            this.subNodes.map((sn) => sn.data.deliverable)
        );
    }

    // build the full context to give our subnodes
    buildSubNodeContext() {
        return this.buildFullContext() + '\n' + this.data.objective;
    }

    // build, track and shake our subnodes
    async handleSubNodeRequests(subNodeRequests: SubNodeRequest[]) {
        let newSubNodes = this.shaker.buildSubNodes(
            this.buildSubNodeContext(),
            subNodeRequests,
            this.data.typeName,
            this.data.id
        );
        this.subNodes.push(...newSubNodes);
        for (let node of newSubNodes) {
            node.supervisor = this;
            await node.shake();
        }
    }
}
