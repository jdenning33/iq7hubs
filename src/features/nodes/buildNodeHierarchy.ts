import {
    NodeTypeDefinitionMap,
    NodeTypeDefintion,
    NodeTypeHierarchy,
} from './NodeTypes';

function buildNodeHierarchy(
    nodetypes: NodeTypeDefinitionMap,
    node: NodeTypeDefintion
): NodeTypeHierarchy {
    return {
        type: node,
        subNodes: node.subNodes?.map((subNode) =>
            buildNodeHierarchy(nodetypes, nodetypes[subNode])
        ),
    };
}
