import { Iq7Agent } from './Iq7Agent';

// Defines all the agents and their sub agents
export type AgentMap = {
    main: Iq7Agent;
    [key: string]: Iq7Agent;
};

// The JobRequest is what the agent would like to request from a sub agent
export type JobRequest = {
    agentName: string;
    objective: string;
};
// The JobResponse is the deliverable and/or additional job requests from the sub agent
export type JobResponse = {
    deliverable: string;
    jobRequests: JobRequest[];
};
// The JobContext is the information the agent needs to make a decision
export type JobContext = {
    objective: string;
    supervisorContext: string;
    subNodeContext: string;
    numberOfAttempts: number;
};

// A Node is what coordinates the process of an Agent completing a Job
// The NodeMeta is the storable information about a node
export type Iq7NodeMeta = {
    id: string;
    agentName: string;
    objective: string;
    deliverable?: string;
    supervisorId?: string;
    status: Iq7NodeStatus;
};
// The NodeStatus is the current state of the node
export type Iq7NodeStatus = 'waiting' | 'working' | 'done' | 'failed';
