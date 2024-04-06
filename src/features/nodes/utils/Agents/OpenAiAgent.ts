import OpenAI from 'openai';

import Anthropic from '@anthropic-ai/sdk';
import { Iq7Agent } from '../Core/Iq7Agent';
import { JobContext, JobRequest, JobResponse } from '../Core/types';
const dirtyJson = require('dirty-json');
//let iter = 0;
export class OpenAiAgent extends Iq7Agent {
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
    const openai = new OpenAI({
        apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'], // This is the default and can be omitted
        baseURL: domain + '/openai/',
        dangerouslyAllowBrowser: true,
    });

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
Return a list of up to 5 strings that represent the objectives for each child. For example: ["Research the thing.", "Design the thing.", "Evaluate the thing.", "Determine how to price the thing."]
NEVER return more than 6 strings.`
                : `
Always respond with a json object of the following typescript type definition { deliverable:string }`
        }
${workInstructions ? workInstructions : ''}
Ensure the JSON data is valid and parsable. 
Always start your response with {"`;
    // console.log('systemText', systemText);

    const msg = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
        temperature: temperature,
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: systemText,
                    },
                ],
            },
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
        // throw new Error('Bad parse');
        console.log(
            'msg.choices[0].message.content',
            msg.choices[0].message.content
        );
        let json = dirtyJson.parse(msg.choices[0].message.content);
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
            'Error parsing JSON from OpenAI response',
            e,
            msg.choices[0].message.content
        );
        //return { deliverable: msg.content[0].text, jobRequests: [] };
        throw new Error('Error parsing JSON from OpenAI response');
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
    const openai = new OpenAI({
        apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'], // This is the default and can be omitted
        baseURL: domain + '/openai/',
        dangerouslyAllowBrowser: true,
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

    const msg = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
        temperature: 0.1,
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: systemText,
                    },
                ],
            },
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

    return {
        deliverable: msg.choices[0].message.content,
        jobRequests: [],
    } as JobResponse;
};
