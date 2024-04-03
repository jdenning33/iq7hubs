import { TryToDeliverContext, TryToDeliverResponse } from './NodeTypes';

export abstract class NodeType {
    abstract name: string;
    abstract description: string;
    private subNodeTypes: string[];
    public getSubNodeTypes() {
        return this.subNodeTypes;
    }

    constructor(subNodeTypes?: string[]) {
        this.subNodeTypes = subNodeTypes || [];
    }

    abstract tryToDeliver(
        deliverContext: TryToDeliverContext
    ): Promise<TryToDeliverResponse>;
}
