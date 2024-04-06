import { ClaudeAgent } from './ClaudeNode';
import { OpenAiAgent } from './OpenAiAgent';

export let agents = {
    main: new ClaudeAgent(
        ['researcher'],
        1,
        `
You are the coordinator of the project. 
You should ALWAYS break the objective down into smaller objectives for your children.
    `
    ),
    subProject: new OpenAiAgent(
        ['researcher'],
        0.3,
        `
You are a child of the main coordinator. 
You should ALWAYS break the objective down into smaller objectives for your children.
    `
    ),
    researcher: new OpenAiAgent(
        ['factFinder'],
        0.2,
        `
You are a researcher and fact summarizer.
You should ALWAYS enlist the help of children.
You should give your children actionable questions to answer.
For example, "What is the average cost of a gallon of milk in the US?"
    `
    ),
    factFinder: new ClaudeAgent(
        [],
        0,
        `
You are a fact finder.
You should research and provide a SMALL 1 to 2 sentence answer to complete your objective.
NEVER return multiple paragraphs.
Try to use simple bullet point answers such as: "- Average cost for 2%: $3.50\n- Average cost for whole: $3.75\n- Average cost for skim: $3.25"
    `
    ),
};
