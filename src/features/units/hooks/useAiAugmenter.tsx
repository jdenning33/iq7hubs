import Anthropic from '@anthropic-ai/sdk';
import { UnitData, useUnits } from './useUnits';
import {
    UnitHierarchy,
    buildSpecificUnitHierarchy,
    buildUnitHierarchy,
} from '../utils/buildUnitHierarchy';
import { groupUnitsByDepth } from '../utils/groupUnitsByDepth';
const dirtyJson = require('dirty-json');

export function useAiAugmenter() {
    const domain = window?.location?.origin || '';
    const anthropic = new Anthropic({
        apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        baseURL: domain + '/anthropic/',
    });

    const clarifyUnitAndChildren = async (
        unit: UnitData,
        children: UnitData[],
        allUnits: UnitData[],
        augmentMessage: string
    ): Promise<{ unit: UnitData; children: UnitData[] }> => {
        console.log('clarify', [unit, ...children], augmentMessage);
        // let response = await fetch(
        //     'http://localhost:3000/anthropic/v1/messages',
        //     {
        //         method: 'POST',
        //     }
        // );

        // const data = await response.json();
        // console.log(data.message);
        // return;

        const unitsByDepth = groupUnitsByDepth(allUnits);
        const unitWithLineage = unitsByDepth
            .flat()
            .find((u) => u.id === unit.id);

        const contextUnitHierarchy = buildUnitHierarchy(allUnits);
        const unitChildren = children;
        const unitHierarchy = buildSpecificUnitHierarchy(unit, unitChildren);

        // Access the message property from the response
        const example = `{"overview":"## Testing Athletes for Steroids\\nDoping and the use of performance-enhancing drugs (PEDs) have been a longstanding issue in the world of sports. To maintain the integrity and fairness of athletic competitions, rigorous testing protocols have been implemented to detect the use of steroids and other banned substances by athletes.","chunks":["### The Need for Steroid Testing\\nSteroids and other PEDs can provide athletes with an unfair advantage, allowing them to build muscle mass, increase strength, and enhance endurance.","### Testing Protocols and Challenges\\nSteroid testing typically involves collecting urine or blood samples from athletes and analyzing them for the presence of banned substances.","### Anti-Doping Efforts and Regulations\\nMajor sports organizations, such as the World Anti-Doping Agency (WADA), have established comprehensive anti-doping codes and policies to regulate the use of PEDs."]}`;
        const messageText =
            'Here is some overall project context: ' +
            JSON.stringify(contextUnitHierarchy) +
            ' \n\n ' +
            'Here is the piece I want to update, your response should be related to this and this only. ' +
            JSON.stringify(unitHierarchy) +
            ' /n/n ' +
            augmentMessage;
        console.log('messageText', messageText);
        const msg = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1000,
            temperature: 0.2,
            system: `
            You will be given "Context:" for the overall project.
            You will ask for and be given a piece to update.
            You will ask for and be given update instructions.
            Always respond with a json object of the following typescript type definition { overview:string, children:string[] } 
            where the overview will be your general response and children will be a series of smaller related items to the overview. 
            You should ONLY return strings for the children.
            You can use markdown formatting for the text. 
            Ensure the JSON data is valid and parsable. 
            All children should have consistent formatting.
            For example: ${example}.             
            Always start your response with {"`,
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
            return {
                unit: { ...unit, description: json.overview },
                children: json.children.map((chunk: any) => ({
                    id: chunk,
                    parentId: unit.id,
                    initiativeId: unit.initiativeId,
                    description: chunk.overview || chunk,
                })),
            };
        } catch (e) {
            console.error('Error parsing JSON from Anthropic response', e);
        }
        return { unit, children: [] };
    };

    return { clarifyUnitAndChildren };
}
