'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface HubData {
    id: string;
    hubName: string;
    description?: string;
    // Add other Hub properties here as needed.
}

interface HubStore {
    hubs: HubData[];
    addHub: (hubData: HubData) => HubData;
    removeHub: (hubId: string) => string;
    updateHub: (hubData: HubData) => HubData;
}

const useStore = create<HubStore>()(
    persist(
        (set, get) => ({
            hubs: [] as HubData[],

            addHub: (hubData: HubData) => {
                const newHub = { ...hubData, id: uuidv4() };
                set((state) => ({ hubs: [...state.hubs, newHub] }));
                return newHub;
            },

            removeHub: (hubId: string) => {
                set((state) => ({
                    hubs: state.hubs.filter((hub) => hub.id !== hubId),
                }));
                return hubId;
            },

            updateHub: (hubData: HubData) => {
                set((state) => ({
                    hubs: state.hubs.map((hub) =>
                        hub.id === hubData.id ? { ...hub, ...hubData } : hub
                    ),
                }));
                return hubData;
            },
        }),
        {
            name: 'hubs-storage', // Key for local storage.
        }
    )
);

export function useHubs() {
    const hubs = useStore((state) => state.hubs);
    const addHub = useStore((state) => state.addHub);
    const removeHub = useStore((state) => state.removeHub);
    const updateHub = useStore((state) => state.updateHub);

    return {
        hubs: hubs,
        createHub: (hubData: HubData) => addHub(hubData),
        deleteHub: (hubId: string) => removeHub(hubId),
        updateHub: (hubData: HubData) => updateHub(hubData),
        getHub: (hubId: string) => hubs.find((hub) => hub.id === hubId),
    };
}
