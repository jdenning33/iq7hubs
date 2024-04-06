'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { UnitData, useUnits } from '../hooks/useUnits'; // Adjust the path as necessary
import { UnitWithLineage, groupUnitsByDepth } from '../utils/groupUnitsByDepth';
import { AddUnitButton } from './AddUnitButton';
import { Unit } from './Unit';

const UnitList = ({ className }: { className?: string }) => {
    const { initiativeId, units } = useUnits();
    const groupedUnitsByDepth = useMemo(
        () => groupUnitsByDepth(units),
        [units]
    );
    const [newUnit, setNewUnit] = useState<UnitData | null>(null);

    const [selectedUnit, setSelectedUnit] = useState<
        UnitWithLineage | undefined
    >();

    useEffect(() => {
        if (!selectedUnit && groupedUnitsByDepth[0]?.[0])
            setSelectedUnit(groupedUnitsByDepth[0][0]);

        if (newUnit) {
            let unitWithLineage = groupedUnitsByDepth
                .flat()
                .find((unit) => unit.id === newUnit.id);
            if (unitWithLineage) {
                setSelectedUnit(unitWithLineage);
                setNewUnit(null);
            }
        }
    }, [groupedUnitsByDepth, newUnit]);

    useEffect(() => {
        if (selectedUnit) {
            scrollLineageToCenter(selectedUnit);
        }
    }, [selectedUnit]);

    function isParentSelected(unit: UnitWithLineage) {
        return unit.lineage.includes(selectedUnit?.id || '');
    }
    function isChildSelected(unit: UnitWithLineage) {
        return selectedUnit?.lineage.includes(unit.id);
    }
    function isSiblingSelected(unit: UnitWithLineage) {
        //return selectedUnit?.parentId === unit.parentId;
        return (
            selectedUnit?.lineage.includes(unit.parentId || '') ||
            unit.lineage.includes(selectedUnit?.parentId || '') ||
            unit.parentId === null
        );
    }

    function scrollLineageToCenter(unit: UnitWithLineage) {
        setTimeout(() => {
            groupedUnitsByDepth.forEach((unitsAtDepth, depth) => {
                const unitToScroll = unitsAtDepth.find((u) => {
                    if (u.id === unit.id) scrollDepthToCenter(depth);
                    return (
                        u.id === unit.id ||
                        u.lineage.includes(unit.id) ||
                        unit.lineage.includes(u.id)
                    );
                });
                if (unitToScroll) {
                    scrollNodeToCenter(unitToScroll.id, depth);
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
        var elementToScroll = document.getElementById(nodeId);
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

    function handleNewUnitAdded(unit: UnitData) {
        setNewUnit(unit);
    }

    return (
        <div
            className={
                'border-2 shadow border-accent-content border-opacity-30 bg-accent bg-opacity-20 rounded-lg px-[10vw] flex overflow-x-scroll simple-scrollbar ' +
                className
            }
        >
            {groupedUnitsByDepth.map((unitsAtDepth, index) => (
                <div
                    id={'scroll' + index}
                    key={index}
                    className='flex flex-col shrink-0 gap-1 overflow-y-scroll overflow-x-visible no-scrollbar'
                >
                    <div className='h-[30vh]'></div>
                    <div className='h-0'>
                        <div className='bg-black bg-opacity-30 p-2'>
                            {unitsAtDepth.map((unit) => (
                                <Unit
                                    key={unit.id}
                                    className={
                                        'bg-base-100 ' +
                                        (selectedUnit?.id === unit.id
                                            ? 'border-l-4 border-l-accent shadow '
                                            : isParentSelected(unit) ||
                                              isChildSelected(unit)
                                            ? 'border-b border-base-content border-opacity-20 '
                                            : isSiblingSelected(unit)
                                            ? 'bg-opacity-60 hover:bg-opacity-70 border-b border-base-content border-opacity-20 '
                                            : 'bg-opacity-10 hover:bg-opacity-20 ')
                                    }
                                    unit={unit}
                                    onSelected={(selected) => {
                                        setSelectedUnit(unit);
                                    }}
                                    onNewUnitAdded={(newunit) => {
                                        handleNewUnitAdded(newunit);
                                    }}
                                    isSelected={unit.id === selectedUnit?.id}
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

export default UnitList;
