import { FirstNodeType, SecondNodeType, ThirdNodeType } from './FirstNodeType';
import { RegisteredNodeTypesMap } from '../NodeTypes';
import { LlmNodeType } from './LlmNode';

export const RegisteredNodeTypes: RegisteredNodeTypesMap = {
    FirstNodeType: (subNodeTypes: string[]) => new FirstNodeType(subNodeTypes),
    SecondNodeType: (subNodeTypes: string[]) =>
        new SecondNodeType(subNodeTypes),
    ThirdNodeType: (subNodeTypes: string[]) => new ThirdNodeType(subNodeTypes),
    LlmNodeType: (subNodeTypes: string[]) => new LlmNodeType(subNodeTypes),
};
