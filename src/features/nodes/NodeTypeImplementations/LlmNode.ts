import Anthropic from '@anthropic-ai/sdk';
import { NodeType } from '../NodeType';
import { TryToDeliverContext, TryToDeliverResponse } from '../NodeTypes';
const dirtyJson = require('dirty-json');
//let iter = 0;
export class LlmNodeType extends NodeType {
    name = 'LlmNodeType';
    description = 'LlmNodeType description';
    async tryToDeliver({
        context,
        objective,
        numberOfAttempts,
    }: TryToDeliverContext): Promise<TryToDeliverResponse> {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (numberOfAttempts > 1) {
            return { deliverable: 'Node Delivered', subNodeRequests: [] };
        }
        let response = await clarify(
            context,
            objective,
            this.getSubNodeTypes()
        );
        return response;
    }
}

const clarify = async (
    context: string,
    objective: string,
    availableSubNodes: string[]
): Promise<TryToDeliverResponse> => {
    const domain = window?.location?.origin || '';
    const anthropic = new Anthropic({
        apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        baseURL: domain + '/anthropic/',
    });
    console.log('clarify', context, 'objective', objective);

    // Access the message property from the response
    const example = `{"overview":"## Testing Athletes for Steroids\\nDoping and the use of performance-enhancing drugs (PEDs) have been a longstanding issue in the world of sports. To maintain the integrity and fairness of athletic competitions, rigorous testing protocols have been implemented to detect the use of steroids and other banned substances by athletes.","chunks":["### The Need for Steroid Testing\\nSteroids and other PEDs can provide athletes with an unfair advantage, allowing them to build muscle mass, increase strength, and enhance endurance.","### Testing Protocols and Challenges\\nSteroid testing typically involves collecting urine or blood samples from athletes and analyzing them for the presence of banned substances.","### Anti-Doping Efforts and Regulations\\nMajor sports organizations, such as the World Anti-Doping Agency (WADA), have established comprehensive anti-doping codes and policies to regulate the use of PEDs."]}`;
    const messageText =
        'Here is some overall project context: ' +
        context +
        ' \n\n ' +
        'Here is what I would like you to do. ' +
        objective;
    console.log('messageText', messageText);
    const systemText = `
        You will be given "Context:" for the overall project.
        You will be given an objective to complete.
        ${
            availableSubNodes.length
                ? `Always respond with a json object of the following typescript type definition { deliverable:string, children:string[] } 
                If you are able to complete the objective, you should return a deliverable string.        
                If you are unable to complete the objective by yourself, you may enlist the help of children to complete the objective.
                Always respond with a json object of the following typescript type definition { deliverable:string, children:string[] } 
                If you are able to complete the objective, you should return a deliverable string.
                If you are unable to complete the objective by yourself, you may enlist the help of children to complete the objective.
                You are encouraged to break the objective down into subtasks and ask for help from children.
                Return a list of strings that represent the objectives for each child.`
                : `Always respond with a json object of the following typescript type definition { deliverable:string }`
        }
        Ensure the JSON data is valid and parsable. 
        Always start your response with {"`;
    console.log('systemText', systemText);

    const msg = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        temperature: 0.2,
        system: systemText,
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: messageText,
                    },
                ],
            },
        ],
    });
    console.log('msg', msg);
    try {
        let json = dirtyJson.parse(msg.content[0].text);
        console.log('json', json);
        if (availableSubNodes.length == 0)
            return { deliverable: json.deliverable, subNodeRequests: [] };
        return {
            deliverable: json.deliverable,
            subNodeRequests: json.children.map((c: string) => ({
                type: availableSubNodes[0],
                request: c,
            })),
        };
    } catch (e) {
        console.error('Error parsing JSON from Anthropic response', e);
    }
    return { deliverable: '', subNodeRequests: [] };
};
