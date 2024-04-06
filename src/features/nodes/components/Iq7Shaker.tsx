import { Iq7NodeMeta } from '../utils/Core/types';
import { useEffect, useState } from 'react';
import { useIq7Nodes } from '../hooks/useIq7Nodes';
import { NodeList } from './NodeList';

//const structuredNodes = buildNodeHierarchy(nodes, nodes['main']);
export const Iq7Shaker = ({ shakerId }: { shakerId: string }) => {
    const { upsertNode, nodes, handleNewJobRequest, shake } =
        useIq7Nodes(shakerId);
    const [lastId, setLastId] = useState<number>(0);

    const persist = (data: Iq7NodeMeta) => {
        upsertNode?.(data);
    };

    useEffect(() => {
        let interval = setInterval(() => {
            console.log('Shaking');
            shake();
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [shake]);

    const [objectiveText, setObjectiveText] = useState<string>('');
    return (
        <div className='bg-red-200'>
            <div
                className='text-lg font-semibold p-2'
                onClick={(_) => {
                    shake();
                }}
            >
                Shaker
            </div>
            <NodeList
                shakerId={shakerId}
                className='w-[90vw] h-[90vh] m-auto'
            />
            {nodes.length ? (
                <></>
            ) : (
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -tranlate-y-1/2 flex gap-2'>
                    <input
                        type='text'
                        className='input'
                        placeholder='Objective'
                        value={objectiveText}
                        onChange={(e) => {
                            setObjectiveText(e.target.value);
                        }}
                    />
                    <button
                        className='btn btn-primary'
                        onClick={(_) =>
                            handleNewJobRequest({
                                agentName: 'main',
                                objective: objectiveText,
                            })
                        }
                    >
                        START
                    </button>
                </div>
            )}
        </div>
    );
};
