'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createContext, useContext, useEffect } from 'react';

export interface InitiativeData {
    id: string;
    hubId: string;
    title: string;
    description: string;
}

interface InitiativeStore {
    initiatives: InitiativeData[];
    addInitiative: (initiativeData: InitiativeData) => InitiativeData;
    removeInitiative: (initiativeId: string) => string;
    updateInitiative: (initiativeData: InitiativeData) => InitiativeData;
    getInitiative: (initiativeId: string) => InitiativeData | undefined;
}

const useInitiativeStore = create<InitiativeStore>()(
    persist(
        (set, get) => ({
            initiatives: [] as InitiativeData[],

            addInitiative: (initiativeData: InitiativeData) => {
                const newInitiative = { ...initiativeData, id: uuidv4() };
                set((state) => ({
                    initiatives: [...state.initiatives, newInitiative],
                }));
                return newInitiative;
            },

            removeInitiative: (initiativeId: string) => {
                set((state) => ({
                    initiatives: state.initiatives.filter(
                        (initiative) => initiative.id !== initiativeId
                    ),
                }));
                return initiativeId;
            },

            updateInitiative: (initiativeData: InitiativeData) => {
                set((state) => ({
                    initiatives: state.initiatives.map((initiative) =>
                        initiative.id === initiativeData.id
                            ? { ...initiative, ...initiativeData }
                            : initiative
                    ),
                }));
                return initiativeData;
            },

            getInitiative: (initiativeId: string) => {
                return get().initiatives.find(
                    (initiative) => initiative.id === initiativeId
                );
            },
        }),
        {
            name: 'initiatives-storage', // Key for local storage.
            skipHydration: true,
        }
    )
);

const InitiativesContext = createContext<InitiativeStore | undefined>(
    undefined
);

export const InitiativesContextProvider = ({
    hubId,
    children,
}: {
    hubId: string;
    children: React.ReactNode;
}) => {
    const store = useInitiativeStore();
    useEffect(() => {
        useInitiativeStore.persist.rehydrate();
    }, []);
    return (
        <InitiativesContext.Provider
            value={{
                ...store,
                initiatives: store.initiatives.filter(
                    (initiative) => initiative.hubId === hubId
                ),
            }}
        >
            {children}
        </InitiativesContext.Provider>
    );
};

export function useInitiatives() {
    const store = useContext(InitiativesContext);
    if (!store) {
        return useInitiativeStore();
    }
    return store;
}
