import { UnitData } from '../hooks/useUnits';

export type UnitHierarchy = {
    overview: string;
    children: UnitHierarchy[];
};

export const buildUnitHierarchy = (units: UnitData[]): UnitHierarchy[] => {
    const rootUnits = units.filter((unit) => !unit.parentId);
    return rootUnits.map((rootUnit) => {
        const getChildren = (unit: UnitData): UnitHierarchy[] =>
            units
                .filter((child) => child.parentId === unit.id)
                .map((child) => ({
                    overview: child.description,
                    children: getChildren(child),
                }));
        return {
            overview: rootUnit.description,
            children: getChildren(rootUnit),
        };
    });
};

export const buildSpecificUnitHierarchy = (
    rootUnit: UnitData,
    units: UnitData[]
): UnitHierarchy => {
    const getChildren = (unit: UnitData): UnitHierarchy[] =>
        units
            .filter((child) => child.parentId === unit.id)
            .map((child) => ({
                overview: child.description,
                children: getChildren(child),
            }));
    return {
        overview: rootUnit.description,
        children: getChildren(rootUnit),
    };
};
