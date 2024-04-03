'use client';
import { Iq7Node } from '@/features/nodes/Iq7Node';
import { Shaker } from '@/features/nodes/Shaker';
import { FirstNodeType } from '@/features/nodes/NodeTypeImplementations/FirstNodeType';
import { NodeHierarchy, useIq7Nodes } from '@/features/nodes/useIq7Nodes';
import { useEffect } from 'react';
import {
    UnitContext,
    UnitContextProvider,
} from '@/features/units/hooks/useUnits';
import UnitList from '@/features/units/components/UnitList';

export default function Page() {
    let { nodes, nodeHierarchies, upsertNode, reset, start } = useIq7Nodes();

    if (!nodeHierarchies) {
        return <div>Nada</div>;
    }

    return (
        <div>
            <h1>Page</h1>
            <button onClick={(_) => console.log(nodes)}>Log Node</button>
            <button onClick={(_) => reset()}>Reset</button>
            <button onClick={(_) => start()}>Start</button>
            {/* <div className='flex flex-col'>
                {nodeHierarchies.map((node) => (
                    <NodeCard key={node.node.id} nodeHierarchy={node} />
                ))}
            </div> */}
            <div>
                <UnitContext.Provider
                    value={{
                        units: nodes.map(
                            (node) =>
                                ({
                                    id: node.id,
                                    parentId: node.supervisorId,
                                    initiativeId: '1',
                                    description: `### ${node.objective} \n\n  ${node.deliverable}`,
                                    title: node.typeName,
                                } as any)
                        ),
                        selectedUnitId: nodes[0]?.id || null,
                        initiativeId: '1',
                        addUnit: () => {
                            throw new Error('Not implemented');
                        },
                        updateUnit: (_) => {
                            throw new Error('Not implemented');
                        },
                        getUnitChildren: () => {
                            throw new Error('Not implemented');
                        },
                        deleteUnit: (_) => {
                            throw new Error('Not implemented');
                        },
                        setSelectedUnitId: (_) => {
                            throw new Error('Not implemented');
                        },
                    }}
                >
                    <div>
                        <UnitList className='w-[90vw] h-[90vh] m-auto' />
                    </div>
                </UnitContext.Provider>
            </div>
        </div>
    );
}

function NodeCard({ nodeHierarchy }: { nodeHierarchy: NodeHierarchy }) {
    const node = nodeHierarchy.node;
    return (
        <div className='flex'>
            <div>
                <div className='w-48 bg-white border shadow rounded overflow-hidden'>
                    <div>{node.typeName}</div>
                    <div>{node.objective}</div>
                    <div>{node.context}</div>
                    <div>{node.status}</div>
                    <div>{node.deliverable}</div>
                </div>
            </div>
            <div className='flex flex-col'>
                {nodeHierarchy.subNodes.map((subNode) => (
                    <NodeCard key={subNode.node.id} nodeHierarchy={subNode} />
                ))}
            </div>
        </div>
    );
}
