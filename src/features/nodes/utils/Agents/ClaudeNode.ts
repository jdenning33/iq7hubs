import Anthropic from '@anthropic-ai/sdk';
import { Iq7Agent } from '../Core/Iq7Agent';
import { JobContext, JobRequest, JobResponse } from '../Core/types';
const dirtyJson = require('dirty-json');
//let iter = 0;
export class ClaudeAgent extends Iq7Agent {
    name = 'LlmNodeType';
    description = 'LlmNodeType description';
    temperature;
    workInstructions;
    maxRuns;

    constructor(
        subAgents?: string[],
        temperature?: number,
        workInstructions?: string,
        maxRuns?: number
    ) {
        super(subAgents);
        this.workInstructions = workInstructions;
        this.maxRuns = maxRuns || 1;
        this.temperature = temperature || 0.2;
    }

    async tryToDeliver({
        supervisorContext,
        subNodeContext,
        objective,
        numberOfAttempts,
    }: JobContext): Promise<JobResponse> {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // if (numberOfAttempts > 1 || this.getSubAgents().length == 0) {
        //     return { deliverable: 'I delivered', jobRequests: [] };
        // } else {
        //     return {
        //         deliverable: '',
        //         jobRequests: [
        //             {
        //                 agentName: this.getSubAgents()[0],
        //                 objective: 'I need you',
        //             },
        //         ],
        //     };
        // }

        if (numberOfAttempts > 0 && subNodeContext) {
            return await summarize(
                this.workInstructions,
                supervisorContext,
                subNodeContext,
                objective,
                this.getSubAgents()
            );
        }
        let response = await clarify(
            this.workInstructions,
            supervisorContext,
            this.temperature,
            objective,
            this.getSubAgents()
        );
        return {
            deliverable: response.deliverable,
            jobRequests: response.jobRequests, //.filter((j, i) => i < 2),
        };
    }
}

const clarify = async (
    workInstructions: string | null | undefined,
    context: string,
    temperature: number,
    objective: string,
    availableSubAgents: string[]
): Promise<JobResponse> => {
    const domain = window?.location?.origin || '';
    const anthropic = new Anthropic({
        apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        baseURL: domain + '/anthropic/',
    });
    // console.log('clarify', context, 'objective', objective);

    // Access the message property from the response
    const messageText =
        'Here is some overall project context: ' +
        context +
        ' \n\n ' +
        'Here is what I would like you to do. ' +
        objective;
    // console.log('messageText', messageText);
    const systemText = `
You will be given "Context:" for the overall project.
You will be given an objective to complete.
        ${
            availableSubAgents.length
                ? `
Always respond with a json object of the following typescript type definition { deliverable:string, children:string[] } 
If you are able to complete the objective, you should return a deliverable string.        
If you are unable to complete the objective by yourself, you may enlist the help of children to complete the objective.
Always respond with a json object of the following typescript type definition { deliverable:string, children:string[] } 
If you are able to complete the objective, you should return a deliverable string.
If you are unable to complete the objective by yourself, you may enlist the help of up to 4 children to complete the objective.
Return a list of strings that represent the objectives for each child.`
                : `
Always respond with a json object of the following typescript type definition { deliverable:string }`
        }
${workInstructions ? workInstructions : ''}
Ensure the JSON data is valid and parsable. 
Never give intro info and always start your response with {"`;
    // console.log('systemText', systemText);

    const msg = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        temperature: temperature,
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
    try {
        console.log('clarify msg', msg.content[0].text);

        let json = dirtyJson.parse(msg.content[0].text);
        console.log('clarify json', json);
        // console.log('json', json);
        if (availableSubAgents.length == 0)
            return { deliverable: json.deliverable, jobRequests: [] };
        return {
            deliverable: json.deliverable,
            jobRequests: json.children.map(
                (c: string) =>
                    ({
                        agentName: availableSubAgents[0],
                        objective: c,
                    } as JobRequest)
            ),
        } as JobResponse;
    } catch (e) {
        console.error(
            'Error parsing JSON from Anthropic response',
            e,
            msg.content[0].text
        );
        //return { deliverable: msg.content[0].text, jobRequests: [] };
        throw new Error('Error parsing JSON from Anthropic response');
    }
};

const summarize = async (
    workInstructions: string | null | undefined,
    context: string,
    subNodeContext: string,
    objective: string,
    availableSubAgents: string[]
): Promise<JobResponse> => {
    const domain = window?.location?.origin || '';
    const anthropic = new Anthropic({
        apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        baseURL: domain + '/anthropic/',
    });

    const messageText =
        'Here is some overall project context: ' +
        context +
        ' \n\n ' +
        'Here is what I would like you to do. ' +
        objective +
        ' \n\n ' +
        'Here are some additional facts to help you complete the objective. ' +
        subNodeContext +
        '\n\n' +
        'Summarize this info and provide a deliverable.';

    const systemText = `
        You will be given "Context:" for the overall project.
        You will be given an objective to complete.
        You will be given additional facts to help you complete the objective.
        You should summarize the facts and provide a very to the point deliverable.
        You can use markdown to format your response.
        `;

    const msg = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        temperature: 0.1,
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
    console.log('summary msg', msg.content[0].text);
    return {
        deliverable: msg.content[0].text,
        jobRequests: [],
    } as JobResponse;
};
