'use client';
import React from 'react';
import Link from 'next/link';
import { useHubs } from '../../hooks/useHubs';

const HubList = () => {
    const { hubs } = useHubs();

    return (
        <table className='table'>
            <thead>
                <tr>
                    <th>Hub Name</th>
                    <th>Hub Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {hubs.map((hub) => (
                    <tr className='hover' key={hub.id}>
                        <td>{hub.hubName}</td>
                        <td>{hub.description}</td>
                        <td>
                            <Link href={`/hubs/${hub.id}`}>View Details</Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default HubList;
