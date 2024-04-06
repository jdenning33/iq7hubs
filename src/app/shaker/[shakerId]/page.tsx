'use client';
import { Iq7Shaker } from '@/features/nodes/components/Iq7Shaker';
import { useParams } from 'next/navigation';

export default function Page() {
    const { shakerId } = useParams<{ shakerId: string }>();

    return (
        <div>
            <div className='m-auto'>
                <Iq7Shaker shakerId={shakerId} />
            </div>
        </div>
    );
}
