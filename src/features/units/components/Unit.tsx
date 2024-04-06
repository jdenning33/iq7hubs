'use client';
import React, { useEffect, useState } from 'react';
import { UnitData, useUnits } from '../hooks/useUnits';
import { UnitWithLineage } from '../utils/groupUnitsByDepth';
import { AddUnitButton } from './AddUnitButton';
import { Iq7Markdown } from '@/components/Iq7Markdown';
import { UnitAugmenterButton } from './UnitAugmenter';

export function Unit({
    unit,
    onSelected,
    isSelected,
    onNewUnitAdded: handleNewUnitAdded,
    className,
}: {
    unit: UnitData;
    onSelected?: React.Dispatch<React.SetStateAction<UnitData | undefined>>;
    isSelected?: boolean;
    onNewUnitAdded?: (unit: UnitData) => void;
    className?: string;
}): React.JSX.Element {
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isSelected && !unit.description) {
            setIsEditing(true);
        }
    }, [isSelected]);

    useEffect(() => {
        if (!isSelected) {
            setIsEditing(false);
        }
    }, [isSelected]);

    const [content, setContent] = useState(unit.description);

    useEffect(() => {
        setContent(unit.description);
    }, [unit.description]);

    const { updateUnit, deleteUnit } = useUnits();
    return (
        <div
            key={unit.id}
            id={unit.id}
            className={`p-2 transition-all relative group ${className} ${
                isEditing && ' bg-primary !text-secondary-content border-2 '
            }
            ${(unit as any).node?.status === 'working' && 'bg-primary'}`}
            onClick={(e: any) => {
                if (e.detail === 2) {
                    setIsEditing(true);
                }
                onSelected?.(unit);
            }}
        >
            <div
                tabIndex={0}
                className='flex flex-col w-[25rem]'
                onKeyUp={(e) => {
                    e.stopPropagation();
                    switch (e.key) {
                        case 'Delete':
                            deleteUnit(unit.id);
                            break;
                        case 'Enter':
                            setIsEditing(true);
                            break;
                    }
                }}
            >
                {isEditing ? (
                    <textarea
                        className='whitespace-pre-wrap markdown p-2 inline-block w-full bg-transparent outline-none border-none'
                        value={content}
                        tabIndex={0}
                        autoFocus={true}
                        onKeyUp={(e) => {
                            e.stopPropagation();
                            switch (e.key) {
                                case 'Escape':
                                    e.currentTarget.blur();
                                    break;
                                case 'Delete':
                                    !content && deleteUnit(unit.id);
                                    break;
                            }
                        }}
                        placeholder='Type here...'
                        onChange={(e: any) => setContent(e.target.value)}
                        onFocus={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height =
                                e.target.scrollHeight + 'px';
                        }}
                        onInput={(e: any) => {
                            e.target.style.height = 'auto';
                            e.target.style.height =
                                e.target.scrollHeight + 'px';
                        }}
                        onBlur={(e) => {
                            setIsEditing(false);
                            console.log(e.target.innerText, content);
                            updateUnit({
                                ...unit,
                                description: content,
                            });
                        }}
                    />
                ) : (
                    <div className='markdown'>
                        <div
                            className={
                                isSelected ? 'font-semibold' : 'font-medium'
                            }
                        >
                            {(unit as any).title || 'Title'}
                            {/* {(unit as any).node && (
                                <button
                                    onClick={(_) => (unit as any).node.shake()}
                                    className='btn btn-xs btn-secondary'
                                >
                                    shake
                                </button>
                            )} */}
                        </div>
                        {isSelected ? (
                            <Iq7Markdown>
                                {unit.description || 'Add some content here...'}
                            </Iq7Markdown>
                        ) : unit.description != 'undefined' ? (
                            '...'
                        ) : (
                            ''
                        )}
                    </div>
                )}
            </div>
            {isSelected && !isEditing && (
                <div
                    className={
                        isSelected && !isEditing
                            ? 'group-focus:opacity-100  group-focus:delay-500'
                            : 'opacity-0'
                    }
                >
                    <UnitAugmenterButton
                        className='!rotate-0 absolute -bottom-1 translate-y-full right-10 btn btn-xs rounded z-10 shadow'
                        unit={unit}
                    >
                        <>Augment</>
                    </UnitAugmenterButton>
                    <AddUnitButton
                        className='!rotate-0 absolute -top-1 right-1 btn btn-xs btn-circle rounded z-10 -translate-y-full'
                        parentId={unit.parentId}
                        initiativeId={unit.initiativeId}
                        afterUnitAdded={handleNewUnitAdded}
                    >
                        {`^`}
                    </AddUnitButton>
                    <AddUnitButton
                        className='!rotate-180 absolute -bottom-1 translate-y-full right-1 btn btn-xs btn-circle rounded z-10'
                        parentId={unit.parentId}
                        initiativeId={unit.initiativeId}
                        afterUnitAdded={handleNewUnitAdded}
                    >
                        {`^`}
                    </AddUnitButton>
                    <AddUnitButton
                        className='!rotate-0 absolute top-1/2 -translate-y-1/2 -right-1 translate-x-full btn btn-xs btn-circle rounded z-10'
                        parentId={unit.id}
                        initiativeId={unit.initiativeId}
                        afterUnitAdded={handleNewUnitAdded}
                    >
                        {`->`}
                    </AddUnitButton>
                </div>
            )}
        </div>
    );
}
