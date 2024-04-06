'use client';
import { useIq7Nodes } from '@/features/nodes/hooks/useIq7Nodes';
import { NodeHierarchy } from '@/features/nodes/utils/buildNodeHierarchy';
import { UnitContext } from '@/features/units/hooks/useUnits';
import UnitList from '@/features/units/components/UnitList';
import { Iq7Shaker } from '@/features/nodes/components/Iq7Shaker';
import { ClaudeAgent } from '@/features/nodes/utils/Agents/ClaudeNode';

export default function Page() {
    let shakerId = 'again';
    let { nodes, reset } = useIq7Nodes(shakerId);

    return (
        <div>
            <h1>Page</h1>
            <button onClick={(_) => console.log(nodes)}>Log Node</button>
            <button onClick={(_) => reset(shakerId)}>Reset</button>
            <div className='m-auto'>
                <Iq7Shaker shakerId={shakerId} />
            </div>
        </div>
    );
}
