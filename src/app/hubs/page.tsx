`use client`;

import { AddHubButton } from '@/features/hubs/components/AddHubButton/AddHubButton';
import HubList from '@/features/hubs/components/HubList/HubList';
import Image from 'next/image';

export default function HubsPage() {
    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            <div className='flex flex-col gap-2'>
                <div className='flex justify-between items-end'>
                    <h1 className='text-xl font-bold'>My Hubs</h1>
                </div>
                <div className='shadow bg-base-200'>
                    <HubList />
                </div>
                <AddHubButton />
            </div>
        </main>
    );
}
