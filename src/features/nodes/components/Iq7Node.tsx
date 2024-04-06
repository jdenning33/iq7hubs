import { Iq7Agent } from '../utils/Core/Iq7Agent';
import { Iq7NodeMeta, Iq7NodeStatus, JobRequest } from '../utils/Core/types';
import { Iq7Shaker } from './Iq7Shaker';
import { useIq7Nodes } from '../hooks/useIq7Nodes';
import { useEffect, useState } from 'react';
import { Iq7Markdown } from '@/components/Iq7Markdown';
import { shakeNode } from '../utils/shakeNode';

/**
 * Represents a job in the system.
 * Jobs have meta
 */
export const Iq7Node = ({
    id,
    data,
    className,
    onClicked,
    onNewNodeAdded,
    isSelected,
}: {
    id: string;
    data: Iq7NodeMeta;
    className?: string;
    onClicked: () => void;
    onNewNodeAdded: (node: Iq7NodeMeta) => void;
    isSelected: boolean;
}) => {
    const { shake, updateNode } = useIq7Nodes();
    useEffect(() => {
        if (data.status === 'done') {
            shake();
        }
    }, [data.status]);
    return (
        <div
            id={id}
            tabIndex={0}
            onClick={(e) => {
                onClicked();
            }}
            className={
                'bg-white rounded border shadow group p-2 relative w-96 ' +
                className
            }
        >
            <div className='markdown'>
                <h4>{data.objective}</h4>
                <span className='bg-accent rounded border text-xs font-medium p-1 absolute bottom-1 right-1'>
                    {data.status}
                </span>
                {isSelected && (
                    <>
                        <Iq7Markdown>
                            {data.deliverable || 'Waiting...'}
                        </Iq7Markdown>
                        <button
                            onClick={(_) =>
                                updateNode({ id: data.id, deliverAttempt: 1 })
                            }
                        >
                            Reset
                        </button>
                        <button onClick={(_) => shake(data.id)}>Shake</button>
                    </>
                )}
            </div>
        </div>
    );
};
