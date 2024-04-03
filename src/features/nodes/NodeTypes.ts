import { NodeType } from './NodeType';

export type NodeTypeDefintion = {
    type: string;
    subNodes?: string[];
};
export type NodeTypeDefinitionMap = {
    [key: string]: NodeTypeDefintion;
};
export type NodeTypeHierarchy = {
    type: NodeTypeDefintion;
    subNodes?: NodeTypeHierarchy[];
};
export type RegisteredNodeTypesMap = {
    [key: string]: (subNodeTypes: string[]) => NodeType;
};
export type SubNodeRequest = {
    type: string;
    request: string;
};
export type TryToDeliverResponse = {
    deliverable: string;
    subNodeRequests: SubNodeRequest[];
};
export type TryToDeliverContext = {
    objective: string;
    context: string;
    numberOfAttempts: number;
};
export type Iq7NodeData = {
    id: string;
    typeName: string;
    objective: string;
    context: string;
    deliverable?: string;
    supervisorId?: string;
    status: NodeStatus;
};
export type NodeStatus = 'waiting' | 'working' | 'done' | 'failed';
