import { AgentMap } from './types';
import { Iq7Node as Iq7Node } from './Iq7Node';
import { Iq7NodeMeta } from './types';
import { JobRequest } from './types';

//const structuredNodes = buildNodeHierarchy(nodes, nodes['main']);
export class Iq7Shaker {
    agents: AgentMap;
    baseNode: Iq7Node;

    private externalPersist?: ((data: Iq7NodeMeta) => void) | undefined;
    persist(data: Iq7NodeMeta) {
        this.externalPersist?.(data);
    }
    constructor(
        objectives: string,
        agents: AgentMap,
        exernalPersist?: ((data: Iq7NodeMeta) => void) | undefined
    ) {
        this.agents = agents;
        this.externalPersist = exernalPersist;
        this.baseNode = this.buildNode({
            agentName: 'main',
            objective: objectives,
            supervisorId: undefined,
        });
        setInterval(() => {
            console.log('Shaking');
            this.shake();
        }, 2000);
    }
    shake() {
        this.baseNode.shake();
    }

    id = 0;
    buildNode(
        {
            agentName,
            objective,
            supervisorId,
        }: Omit<Iq7NodeMeta, 'id' | 'status'>,
        supervisorName?: string
    ) {
        console.log(
            'Building node of type:',
            agentName,
            ' for supervisor of type: ',
            supervisorName
        );
        if (supervisorName) {
            let supervisor = this.agents[supervisorName];
            if (!supervisor?.getSubAgents()?.includes(agentName)) {
                throw new Error('Node type not allowed');
            }
        }
        let agent = this.agents[agentName];
        if (agent) {
            return new Iq7Node(
                agent,
                {
                    id: this.id++ + '',
                    agentName: agentName,
                    objective,
                    status: 'waiting',
                    supervisorId: supervisorId,
                },
                this
            );
        } else {
            throw new Error('Node type not found');
        }
    }

    buildSubNodes(
        requests: JobRequest[],
        supervisorType?: string,
        supervisorId?: string
    ): Iq7Node[] {
        let subNodes: Iq7Node[] = requests.map((request) => {
            return this.buildNode(
                {
                    agentName: request.agentName,
                    objective: request.objective,
                    supervisorId: supervisorId,
                },
                supervisorType
            );
        });
        return subNodes;
    }
}
