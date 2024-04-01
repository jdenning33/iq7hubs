`use client`;

import { AddHubButton } from '@/features/hubs/components/AddHubButton/AddHubButton';
import HubList from '@/features/hubs/components/HubList/HubList';
import Image from 'next/image';
import Link from 'next/link';
import HubsPage from './hubs/page';

export default function Home() {
    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            <HubsPage />
        </main>
    );
}
