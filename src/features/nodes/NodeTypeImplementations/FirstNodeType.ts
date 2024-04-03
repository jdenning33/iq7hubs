import { NodeType } from '../NodeType';
import { TryToDeliverContext } from '../NodeTypes';

export class FirstNodeType extends NodeType {
    name = 'FirstNodeType';
    description = 'Calls two SecondNodeType nodes';
    run = 0;

    async tryToDeliver({ context }: TryToDeliverContext) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        this.run++;
        if (this.run > 1 || context.includes('Delivered'))
            return {
                deliverable: 'First Node Delivered',
                subNodeRequests: [],
            };
        return {
            deliverable: '',
            subNodeRequests: [
                { type: 'SecondNodeType', request: 'Boom Deliver 1' },
                { type: 'SecondNodeType', request: 'Boom Deliver 2' },
            ],
        };
    }
}
export class SecondNodeType extends NodeType {
    name = 'SecondNodeType';
    description = 'SecondNodeType description';

    async tryToDeliver({}: TryToDeliverContext) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (Math.random() > 0.3) {
            return {
                deliverable: 'Second Node Delivered',
                subNodeRequests: [],
            };
        } else {
            return {
                deliverable: '',
                subNodeRequests: [{ type: 'ThirdNodeType', request: 'Boom' }],
            };
        }
    }
}
export class ThirdNodeType extends NodeType {
    name = 'ThirdNodeType';
    description = 'ThirdNodeType description';

    async tryToDeliver({}: TryToDeliverContext) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        let subNodeTypes = this.getSubNodeTypes();
        if (subNodeTypes.length > 0 && Math.random() > 0.3) {
            return {
                deliverable: '',
                subNodeRequests: [
                    {
                        type: subNodeTypes[
                            Math.floor(Math.random() * subNodeTypes.length)
                        ],
                        request: 'Boom',
                    },
                ],
            };
        } else {
            return {
                deliverable: 'Third Node Delivered',
                subNodeRequests: [],
            };
        }
    }
}
