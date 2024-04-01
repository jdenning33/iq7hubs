import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createContext, useContext } from 'react';

// Define the unit data structure
export interface UnitData {
    id: string;
    initiativeId: string;
    parentId: string | null; // Root units have null parentId
    order: number;
    description: string;
    // Additional fields as needed
}

interface UnitStore {
    units: UnitData[];
    addUnit: (unitData: Omit<UnitData, 'id'>) => UnitData;
    updateUnit: (unitData: UnitData) => UnitData;
    deleteUnit: (id: string) => void;
    getUnitChildren: (parentId: string) => UnitData[];
    setSelectedUnitId: (id: string | null) => void;
    selectedUnitId: string | null;
}

const useAllUnits = create<UnitStore>()(
    persist(
        (set, get) =>
            ({
                units: [],
                addUnit: (unitData) => {
                    let unitToUpdate = { ...unitData, id: uuidv4() };
                    set((state) => ({
                        units: [...state.units, unitToUpdate],
                    }));
                    return unitToUpdate;
                },
                updateUnit: (unitData) => {
                    set((state) => ({
                        units: state.units.map((unit) =>
                            unit.id === unitData.id
                                ? { ...unit, ...unitData }
                                : unit
                        ),
                    }));
                    return unitData;
                },
                deleteUnit: (id) =>
                    set((state) => ({
                        units: state.units.filter((unit) => unit.id !== id),
                    })),
                getUnitChildren: (parentId) =>
                    get().units.filter((unit) => unit.parentId === parentId),
                setSelectedUnitId: (id) =>
                    set(() => ({
                        selectedUnitId: id,
                    })),
                selectedUnitId: null,
            } as UnitStore),
        {
            name: 'units-storage', // Key for local storage persistence
        }
    )
);

type UnitContextType = UnitStore & { initiativeId: string };
const UnitContext = createContext<UnitContextType | undefined>(undefined);
export const UnitContextProvider = function ({
    initiativeId,
    children,
}: {
    initiativeId: string;
    children: React.ReactNode;
}) {
    const store = useAllUnits();
    return (
        <UnitContext.Provider
            value={{
                ...store,
                initiativeId,
                units: store.units.filter(
                    (unit) => unit.initiativeId === initiativeId
                ),
            }}
        >
            {children}
        </UnitContext.Provider>
    );
};
export const useUnits = () => {
    const store = useContext(UnitContext);
    if (!store) {
        throw new Error('useUnits must be used within a UnitContextProvider');
    }
    return store;
};
