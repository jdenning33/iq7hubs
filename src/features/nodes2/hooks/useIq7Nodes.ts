import { create } from 'zustand';
import { Iq7NodeMeta } from '../components/types';
import { Iq7Shaker } from '../components/Iq7Shaker';
import { AgentMap } from '../components/types';
import { LlmNodeType } from '../components/Agents/LlmNode';

type Iq7NodeStoreState = {
    nodes: Iq7NodeMeta[];
    isRunning: boolean;
    reset: () => void;
    addNode: (nodeData: Iq7NodeMeta) => Iq7NodeMeta;
    updateNode: (nodeData: Iq7NodeMeta) => Iq7NodeMeta;
    upsertNode: (nodeData: Iq7NodeMeta) => Iq7NodeMeta;
    deleteNode: (id: string) => void;
    setIsRunning: (running: boolean) => void;
};

export const useIq7NodeStore = create<Iq7NodeStoreState>()((set, get) => ({
    nodes: [] as Iq7NodeMeta[],
    isRunning: false,
    setIsRunning: (running: boolean) => set({ isRunning: running }),
    reset: () => set({ nodes: [], isRunning: false }),
    addNode: (nodeData: Iq7NodeMeta): Iq7NodeMeta => {
        let nodeToUpdate = {
            ...nodeData,
        } as Iq7NodeMeta;
        set((state) => ({
            nodes: [...state.nodes, nodeToUpdate],
        }));
        return nodeToUpdate;
    },
    updateNode: (nodeData: Iq7NodeMeta) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === nodeData.id
                    ? ({ ...node, ...nodeData } as Iq7NodeMeta)
                    : node
            ),
        }));
        return nodeData;
    },
    upsertNode: (nodeData: Iq7NodeMeta) => {
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
    node: Iq7NodeMeta;
    subNodes: NodeHierarchy[];
};
export function useIq7Nodes() {
    const store = useIq7NodeStore();

    //recursively build a hierarchy of nodes
    function buildNodeHierarchy(node: Iq7NodeMeta): NodeHierarchy {
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
            const nodeTypes: AgentMap = {
                main: new LlmNodeType(
                    ['subProject'],
                    1,
                    `
You are the coordinator of the project. 
You should break the objective down into smaller objectives for your children.
                `
                ),
                subProject: new LlmNodeType(
                    ['researcher'],
                    0.3,
                    `
You are a child of the main coordinator. 
You should ALWAYS break the objective down into smaller objectives for your children.
                `
                ),
                researcher: new LlmNodeType(
                    ['factFinder'],
                    0.2,
                    `
You are a researcher and fact summarizer.
You should ALWAYS enlist the help of children.
You should give your children actionable questions to answer.
For example, "What is the average cost of a gallon of milk in the US?"
                `
                ),
                factFinder: new LlmNodeType(
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

            let nodeShaker = new Iq7Shaker(
                'Suggest a good SAAS to start as a sole founder with a software engineering background. The SAAS should be centered around some aspect of the wedding industry.',
                nodeTypes,
                store.upsertNode
            );
            nodeShaker.shake();
        }
    }

    return { ...store, nodeHierarchies: nodeHierarchy, start };
}
