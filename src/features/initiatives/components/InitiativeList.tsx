// Assuming you have a useInitiatives hook similar to useHubs
import React from 'react';
import Link from 'next/link';
import { useInitiatives } from '../hooks/useInitiatives';

const InitiativeList = () => {
    const { initiatives } = useInitiatives();

    return (
        <div className='overflow-x-auto'>
            <table className='table w-full'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Hub</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {initiatives.map((initiative) => (
                        <tr className='hover' key={initiative.id}>
                            <td>{initiative.title}</td>
                            <td>{initiative.description}</td>
                            <td>
                                {/* Assuming hubId corresponds to a hub's name - you might need a method to fetch the hub's name by its ID */}
                                <Link href={`/hubs/${initiative.hubId}`}>
                                    View Hub
                                </Link>
                            </td>
                            <td>
                                {/* Link to a page for viewing or editing the initiative details */}
                                <Link href={`/initiatives/${initiative.id}`}>
                                    View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InitiativeList;
