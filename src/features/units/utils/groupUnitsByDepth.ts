import { UnitData } from '../hooks/useUnits';

export type UnitWithLineage = UnitData & { lineage: string[] };
export const groupUnitsByDepth = (units: UnitData[]) => {
    const rootUnits = units.filter((unit) => !unit.parentId);

    const childrenByDepth: UnitWithLineage[][] = [];
    const addChildrenAndDepth = (
        unit: UnitData | UnitWithLineage,
        parent: UnitWithLineage | null,
        depth = 0
    ) => {
        childrenByDepth[depth] = childrenByDepth[depth] || [];
        const unitWithLineage = {
            ...unit,
            lineage: parent ? [...parent.lineage, parent.id] : [],
        };
        childrenByDepth[depth].push(unitWithLineage);
        const children = units.filter((u) => u.parentId === unit.id);
        children.forEach((child) =>
            addChildrenAndDepth(child, unitWithLineage, depth + 1)
        );
    };
    rootUnits.forEach((child) => addChildrenAndDepth(child, null, 0));
    return childrenByDepth;
};
