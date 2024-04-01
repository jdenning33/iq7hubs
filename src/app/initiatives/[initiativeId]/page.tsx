'use client';

import { useInitiatives } from '@/features/initiatives/hooks/useInitiatives';
import { AddUnitButton } from '@/features/units/components/AddUnitButton';
import UnitList from '@/features/units/components/UnitList';
import { UnitContextProvider } from '@/features/units/hooks/useUnits';
import { useParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';

export default function InitiativesPage() {
    const { initiativeId } = useParams<{ initiativeId: string }>();
    const { initiatives, getInitiative } = useInitiatives();
    const initiative = useMemo(
        () => getInitiative(initiativeId),
        [initiativeId, initiatives]
    );

    return (
        <main className='flex min-h-screen flex-col items-center p-8'>
            <Suspense fallback={<div>Loading...</div>}>
                <UnitContextProvider initiativeId={initiativeId}>
                    <div className='flex flex-1 flex-col gap-4'>
                        <div className='flex justify-between items-end'>
                            <div className='flex flex-col gap-2'>
                                <div className='text-xl font-bold'>
                                    {`[Initiative]`} {initiative?.title}
                                </div>
                                <div className='font-medium'>
                                    {initiative?.description}
                                </div>
                            </div>

                            <AddUnitButton initiativeId={initiativeId} />
                        </div>
                        <UnitList className='flex-1 w-[90vw] ' />
                    </div>
                </UnitContextProvider>
            </Suspense>
        </main>
    );
}

function Helper() {
    return null;
}
