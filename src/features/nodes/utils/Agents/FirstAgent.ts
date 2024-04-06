import { Iq7Agent } from '../Core/Iq7Agent';
import { JobContext, JobRequest, JobResponse } from '../Core/types';

export class FirstNodeType extends Iq7Agent {
    name = 'FirstNodeType';
    description = 'Calls two SecondNodeType nodes';
    run = 0;

    async tryToDeliver({ supervisorContext: context }: JobContext) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        this.run++;
        if (this.run > 1 || context.includes('Delivered'))
            return {
                deliverable: 'First Node Delivered',
                jobRequests: [],
            };
        return {
            deliverable: '',
            jobRequests: [
                { agentName: 'SecondNodeType', objective: 'Boom Deliver 1' },
                { agentName: 'SecondNodeType', objective: 'Boom Deliver 2' },
            ],
        };
    }
}
export class SecondNodeType extends Iq7Agent {
    name = 'SecondNodeType';
    description = 'SecondNodeType description';

    async tryToDeliver({}: JobContext): Promise<JobResponse> {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (Math.random() > 0.3) {
            return {
                deliverable: 'Second Node Delivered',
                jobRequests: [],
            };
        } else {
            return {
                deliverable: '',
                jobRequests: [
                    { agentName: 'ThirdNodeType', objective: 'Boom' },
                ],
            };
        }
    }
}
export class ThirdNodeType extends Iq7Agent {
    name = 'ThirdNodeType';
    description = 'ThirdNodeType description';

    async tryToDeliver({}: JobContext) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        let subNodeTypes = this.getSubAgents();
        if (subNodeTypes.length > 0 && Math.random() > 0.3) {
            return {
                deliverable: '',
                jobRequests: [
                    {
                        agentName:
                            subNodeTypes[
                                Math.floor(Math.random() * subNodeTypes.length)
                            ],
                        objective: 'Boom',
                    },
                ],
            };
        } else {
            return {
                deliverable: 'Third Node Delivered',
                jobRequests: [],
            };
        }
    }
}
