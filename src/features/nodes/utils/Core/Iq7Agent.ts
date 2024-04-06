import { JobContext, JobResponse } from './types';

export abstract class Iq7Agent {
    abstract name: string;
    abstract description: string;

    private subAgents: string[];
    public getSubAgents() {
        return this.subAgents;
    }

    constructor(subAgents?: string[]) {
        this.subAgents = subAgents || [];
    }

    abstract tryToDeliver(deliverContext: JobContext): Promise<JobResponse>;
}
