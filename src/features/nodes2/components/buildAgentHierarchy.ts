import { Iq7Agent } from './Iq7Agent';
import { AgentMap } from './types';

export function buildAgentHierarchy(
    agentName: string,
    agent: Iq7Agent,
    allAgents: AgentMap
): AgentHierarchy {
    return {
        agentName: agentName,
        agent: agent,
        subAgents: agent
            .getSubAgents()
            .map((agentName) =>
                buildAgentHierarchy(agentName, allAgents[agentName], allAgents)
            ),
    };
} // Represents the agency in a recursive structure

export type AgentHierarchy = {
    agentName: string;
    agent: Iq7Agent;
    subAgents?: AgentHierarchy[];
};
