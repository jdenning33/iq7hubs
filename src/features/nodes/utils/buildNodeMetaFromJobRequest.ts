import { Iq7NodeMeta, JobRequest } from './Core/types';
import { AgentMap } from './Core/types';

export function buildNodeMetaFromJobRequest(
    { agentName, objective }: JobRequest,
    agents: AgentMap,
    supervisor?: Iq7NodeMeta
) {
    console.log(
        'Building node of type:',
        agentName,
        ' for supervisor : ',
        supervisor?.agentName
    );
    if (supervisor) {
        let supervisorAgent = agents[supervisor.agentName];
        if (!supervisorAgent?.getSubAgents()?.includes(agentName)) {
            throw new Error('Node type not allowed');
        }
    }
    let agent = agents[agentName];
    if (agent) {
        return {
            agentName: agentName,
            objective,
            status: 'waiting',
            deliverAttempt: 0,
            supervisorId: supervisor?.id,
        } as Iq7NodeMeta;
    } else {
        throw new Error('Node type not found');
    }
}
