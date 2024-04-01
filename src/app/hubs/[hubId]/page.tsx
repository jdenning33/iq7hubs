'use client';

import { AddHubButton } from '@/features/hubs/components/AddHubButton/AddHubButton';
import { useHubs } from '@/features/hubs/hooks/useHubs';
import { AddInitiativeButton } from '@/features/initiatives/components/AddInitiativeButton';
import InitiativeList from '@/features/initiatives/components/InitiativeList';
import { InitiativesContextProvider } from '@/features/initiatives/hooks/useInitiatives';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export default function HubsPage() {
    const { hubId } = useParams<{ hubId: string }>();
    const { getHub } = useHubs();
    const hub = getHub(hubId);

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className=''>
                        <h1 className='text-xl font-bold'>
                            [Hub] {hub?.hubName}
                        </h1>
                        <h2 className='font-medium'>{hub?.description}</h2>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <InitiativesContextProvider hubId={hubId}>
                        <div className='flex justify-between items-end'>
                            <h2 className='text-lg font-bold'>
                                My Initiatives
                            </h2>
                        </div>
                        <div className='shadow bg-base-200'>
                            <InitiativeList />
                        </div>
                        <AddInitiativeButton hubId={hubId} />
                    </InitiativesContextProvider>
                </div>
            </div>
        </main>
    );
}
