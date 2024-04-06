import { create } from 'zustand';
import { Iq7NodeMeta } from '../utils/Core/types';
import { persist } from 'zustand/middleware';

type Iq7NodeStoreState = {
    nodes: Iq7NodeMeta[];
    isRunning: boolean;
    reset: (shakerId: string) => void;
    addNode: (nodeData: Iq7NodeMeta) => Iq7NodeMeta;
    updateNode: (nodeData: Partial<Iq7NodeMeta>) => Iq7NodeMeta;
    upsertNode: (nodeData: Iq7NodeMeta) => Iq7NodeMeta;
    deleteNode: (id: string) => void;
    setIsRunning: (running: boolean) => void;
};

// how do I persist this store
// https://stackoverflow.com/questions/67232254/how-to-persist-zustand-store-in-localstorage

export const useIq7NodeStore = create<Iq7NodeStoreState>()(
    persist(
        (set, get) => ({
            nodes: [] as Iq7NodeMeta[],
            isRunning: false,
            setIsRunning: (running: boolean) => set({ isRunning: running }),
            reset: (shakerId: string) =>
                set({
                    nodes: get().nodes.filter((n) => n.shakerId !== shakerId),
                    isRunning: false,
                }),
            addNode: (nodeData: Iq7NodeMeta): Iq7NodeMeta => {
                let nodeToUpdate = {
                    ...nodeData,
                    id: Math.random().toString(36).slice(2, 9),
                } as Iq7NodeMeta;
                set((state) => ({
                    nodes: [...state.nodes, nodeToUpdate],
                }));
                return nodeToUpdate;
            },
            updateNode: (nodeData: Partial<Iq7NodeMeta>) => {
                let existingNode = get().nodes.find(
                    (n) => n.id === nodeData.id
                );
                if (!existingNode) {
                    throw new Error('Node not found');
                }
                set((state) => ({
                    nodes: state.nodes.map((node) =>
                        node.id === nodeData.id
                            ? ({ ...node, ...nodeData } as Iq7NodeMeta)
                            : node
                    ),
                }));
                return existingNode;
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
        }),
        {
            name: 'node-storage', // Key for local storage persistence
        }
    )
);
