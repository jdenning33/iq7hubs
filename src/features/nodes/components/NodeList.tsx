'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useIq7Nodes } from '../hooks/useIq7Nodes';
import { NodeWithLineage, groupNodesByDepth } from '../utils/groupNodesByDepth';
import { Iq7NodeMeta } from '../utils/Core/types';
import { Iq7Node } from './Iq7Node';

export const NodeList = ({
    className,
    shakerId,
}: {
    className?: string;
    shakerId: string;
}) => {
    const { nodes } = useIq7Nodes(shakerId);
    const [selectedNode, setSelectedNode] = useState<
        NodeWithLineage | undefined
    >();
    const groupedNodesByDepth = useMemo(
        () => groupNodesByDepth(nodes),
        [nodes]
    );
    const [newNode, setNewNode] = useState<Iq7NodeMeta | null>(null);

    useEffect(() => {
        if (!selectedNode && groupedNodesByDepth[0]?.[0])
            setSelectedNode(groupedNodesByDepth[0][0]);

        if (newNode) {
            let nodeWithLineage = groupedNodesByDepth
                .flat()
                .find((node) => node.id === newNode.id);
            if (nodeWithLineage) {
                setSelectedNode(nodeWithLineage);
                setNewNode(null);
            }
        }
    }, [groupNodesByDepth, newNode]);

    useEffect(() => {
        if (selectedNode?.id) {
            scrollLineageToCenter(selectedNode);
        }
    }, [selectedNode?.id]);

    function isParentSelected(node: NodeWithLineage) {
        return node.lineage.includes(selectedNode?.id || '');
    }
    function isChildSelected(node: NodeWithLineage) {
        return selectedNode?.lineage.includes(node.id);
    }
    function isSiblingSelected(node: NodeWithLineage) {
        //return selectedUnit?.parentId === unit.parentId;
        return (
            selectedNode?.lineage.includes(node.supervisorId || '') ||
            node.lineage.includes(selectedNode?.supervisorId || '') ||
            node.supervisorId === null
        );
    }

    function scrollLineageToCenter(node: NodeWithLineage) {
        setTimeout(() => {
            groupedNodesByDepth.forEach((nodesAtDepth, depth) => {
                const nodeToScroll = nodesAtDepth.find((n) => {
                    if (n.id === node.id) scrollDepthToCenter(depth);
                    return (
                        n.id === node.id ||
                        n.lineage.includes(node.id) ||
                        node.lineage.includes(n.id)
                    );
                });
                if (nodeToScroll) {
                    scrollNodeToCenter(nodeToScroll.id, depth);
                }
            });
        }, 200);
    }

    function scrollDepthToCenter(depth: number) {
        setTimeout(() => {
            var scrollableContainer = document.getElementById('scroll' + depth);
            if (scrollableContainer) {
                console.log('scrolling', depth);
                scrollableContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            }
        }, 10);
    }

    function scrollNodeToCenter(nodeId: string, columnIndex: number) {
        var elementToScroll = document.getElementById('node-' + nodeId);
        var scrollableContainer = document.getElementById(
            'scroll' + columnIndex
        );
        if (elementToScroll && scrollableContainer) {
            var elementRect = elementToScroll.getBoundingClientRect();
            var containerRect = scrollableContainer.getBoundingClientRect();
            var middle = containerRect.top + containerRect.height / 4;
            var offset = elementRect.top - middle;

            scrollableContainer.scrollBy({
                top: offset,
                behavior: 'smooth',
            });
        }
    }

    function handleNewNodeAdded(node: Iq7NodeMeta) {
        setNewNode(node);
    }

    return (
        <div
            className={
                'border-2 shadow border-accent-content border-opacity-30 bg-accent bg-opacity-20 rounded-lg px-[10vw] flex overflow-x-scroll simple-scrollbar ' +
                className
            }
        >
            {groupedNodesByDepth.map((nodesAtDepth, depth) => (
                <div
                    id={'scroll' + depth}
                    key={depth}
                    className='flex flex-col shrink-0 gap-1 overflow-y-scroll overflow-x-visible no-scrollbar'
                >
                    <div className='h-[30vh]'></div>
                    <div className='h-0'>
                        <div className='bg-black bg-opacity-30 p-2'>
                            {nodesAtDepth.map((node) => (
                                <Iq7Node
                                    key={node.id}
                                    id={'node-' + node.id}
                                    className={
                                        'bg-base-100 ' +
                                        (selectedNode?.id === node.id
                                            ? 'border-l-4 border-l-accent shadow '
                                            : isParentSelected(node) ||
                                              isChildSelected(node)
                                            ? 'border-b border-base-content border-opacity-20 '
                                            : isSiblingSelected(node)
                                            ? 'bg-opacity-60 hover:bg-opacity-70 border-b border-base-content border-opacity-20 '
                                            : 'bg-opacity-10 hover:bg-opacity-20 ')
                                    }
                                    data={node}
                                    onClicked={() => {
                                        setSelectedNode(node);
                                    }}
                                    onNewNodeAdded={(newNode) => {
                                        handleNewNodeAdded(newNode);
                                    }}
                                    isSelected={node.id === selectedNode?.id}
                                />
                            ))}
                        </div>
                        <div className='h-[70vh]'></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
