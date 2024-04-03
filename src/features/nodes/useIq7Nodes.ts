import { useState } from 'react';
import { create } from 'zustand';
import { Iq7NodeData } from './NodeTypes';
import { Shaker } from './Shaker';
import { NodeTypeDefinitionMap } from './NodeTypes';
import { FirstNodeType } from './NodeTypeImplementations/FirstNodeType';

type Iq7NodeStoreState = {
    nodes: Iq7NodeData[];
    isRunning: boolean;
    reset: () => void;
    addNode: (nodeData: Iq7NodeData) => Iq7NodeData;
    updateNode: (nodeData: Iq7NodeData) => Iq7NodeData;
    upsertNode: (nodeData: Iq7NodeData) => Iq7NodeData;
    deleteNode: (id: string) => void;
    setIsRunning: (running: boolean) => void;
};

export const useIq7NodeStore = create<Iq7NodeStoreState>()((set, get) => ({
    nodes: [] as Iq7NodeData[],
    isRunning: false,
    setIsRunning: (running: boolean) => set({ isRunning: running }),
    reset: () => set({ nodes: [], isRunning: false }),
    addNode: (nodeData: Iq7NodeData): Iq7NodeData => {
        let nodeToUpdate = {
            ...nodeData,
        } as Iq7NodeData;
        set((state) => ({
            nodes: [...state.nodes, nodeToUpdate],
        }));
        return nodeToUpdate;
    },
    updateNode: (nodeData: Iq7NodeData) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === nodeData.id
                    ? ({ ...node, ...nodeData } as Iq7NodeData)
                    : node
            ),
        }));
        return nodeData;
    },
    upsertNode: (nodeData: Iq7NodeData) => {
        let node = get().nodes.find((n) => n.id === nodeData.id);
        if (node) {
            return get().updateNode(nodeData);
        } else {
            return get().addNode(nodeData);
        }
    },
    deleteNode: (id: string) =>
        set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
        })),
}));

export type NodeHierarchy = {
    node: Iq7NodeData;
    subNodes: NodeHierarchy[];
};
export function useIq7Nodes() {
    const store = useIq7NodeStore();

    //recursively build a hierarchy of nodes
    function buildNodeHierarchy(node: Iq7NodeData): NodeHierarchy {
        let subNodes = store.nodes
            .filter((n) => n.supervisorId === node.id)
            .map((n) => buildNodeHierarchy(n));
        return { node, subNodes };
    }
    let baseNodes = store.nodes.filter((n) => !n.supervisorId);
    let nodeHierarchy = baseNodes.map((n) => buildNodeHierarchy(n));

    function start() {
        if (!store.isRunning) {
            store.setIsRunning(true);
            const nodeTypes: NodeTypeDefinitionMap = {
                main: {
                    type: 'LlmNodeType',
                    subNodes: ['sub'],
                },
                sub: {
                    type: 'LlmNodeType',
                    subNodes: ['third'],
                },
                third: {
                    type: 'LlmNodeType',
                },
                project_manager: {
                    type: 'ThirdNodeType',
                    subNodes: ['code_manager', 'developer'],
                },
                code_manager: { type: 'ThirdNodeType' },
                developer: { type: 'ThirdNodeType' },
            };

            let nodeShaker = new Shaker(nodeTypes, store.upsertNode);
            let node = nodeShaker.buildNode(
                'main',
                'Decide if a wedding planning saas centered around day of timeline planning is viable.',
                'Context'
            );
            node.shake();
        }
    }

    return { ...store, nodeHierarchies: nodeHierarchy, start };
}
