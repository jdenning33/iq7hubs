import { NodeTypeDefinitionMap } from './NodeTypes';
import { Iq7Node } from './Iq7Node';
import { Iq7NodeData } from './NodeTypes';
import { RegisteredNodeTypes } from './NodeTypeImplementations/RegisteredNodeTypes';
import { SubNodeRequest } from './NodeTypes';

//const structuredNodes = buildNodeHierarchy(nodes, nodes['main']);
export class Shaker {
    nodeTypes: NodeTypeDefinitionMap;

    private externalPersist?: ((data: Iq7NodeData) => void) | undefined;
    persist(data: Iq7NodeData) {
        this.externalPersist?.(data);
    }
    constructor(
        nodeTypeDefinitions: NodeTypeDefinitionMap,
        exernalPersist?: ((data: Iq7NodeData) => void) | undefined
    ) {
        this.nodeTypes = nodeTypeDefinitions;
        this.externalPersist = exernalPersist;
    }

    id = 0;
    buildNode(
        type: string,
        objective: string,
        context: string,
        supervisorType?: string,
        supervisorId?: string
    ) {
        console.log(
            'Building node of type:',
            type,
            ' for supervisor of type: ',
            supervisorType
        );
        if (supervisorType) {
            let supervisorTypeDefinition = this.nodeTypes[supervisorType];
            if (!supervisorTypeDefinition?.subNodes?.includes(type)) {
                throw new Error('Node type not allowed');
            }
        }
        let nodeTypeDefinition = this.nodeTypes[type];
        let nodeType = RegisteredNodeTypes[nodeTypeDefinition.type](
            nodeTypeDefinition.subNodes || []
        );
        if (nodeType) {
            return new Iq7Node(
                nodeType,
                {
                    id: this.id++ + '',
                    typeName: type,
                    objective,
                    context,
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
        subNodeContext: string,
        requests: SubNodeRequest[],
        supervisorType?: string,
        supervisorId?: string
    ): Iq7Node[] {
        let subNodes: Iq7Node[] = requests.map((request) => {
            return this.buildNode(
                request.type,
                request.request,
                subNodeContext,
                supervisorType,
                supervisorId
            );
        });
        return subNodes;
    }
}
