import Modal from '@/components/Modal';
import { UnitData, useUnits } from '../hooks/useUnits';
import { SetStateAction, useState } from 'react';
import { Unit } from './Unit';
import { UnitWithLineage } from '../utils/groupUnitsByDepth';
import { useForm } from 'react-hook-form';
import { useAiAugmenter } from '../hooks/useAiAugmenter';

export function UnitAugmenterButton({
    className,
    unit,
    children,
}: {
    className?: string;
    unit: UnitData;
    children?: React.ReactNode;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <button
                className={'btn btn-sm btn-primary ' + className}
                onClick={openModal}
            >
                {children || 'Edit'}
            </button>
            <Modal
                size='fit'
                title='Augment Unit'
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                <UnitAugmenter unit={unit} afterSubmit={(_) => closeModal()} />
            </Modal>
        </>
    );
}

export function UnitAugmenter({
    unit,
    afterSubmit,
}: {
    unit: UnitData;
    afterSubmit: (unit: UnitData) => void;
}) {
    const { units, updateUnit } = useUnits();
    let children = units.filter((u) => u.parentId === unit.id);

    const [suggestedUnit, setSuggestedUnit] = useState<UnitData | null>(unit);
    const [suggestedChildren, setSuggestedChildren] =
        useState<UnitData[]>(children);

    return (
        <div className='flex flex-col gap-6 overflow-hidden h-full'>
            <div className='flex-1 flex flex-col gap-6 overflow-auto'>
                <div className='flex gap-6'>
                    <StyledUnit unit={unit} />
                    {suggestedUnit && (
                        <div className='relative'>
                            <StyledUnit unit={suggestedUnit} />
                            <button
                                className='btn btn-sm btn-primary absolute bottom-1 right-1'
                                onClick={() => {
                                    updateUnit(suggestedUnit);
                                }}
                            >
                                USE THIS
                            </button>
                        </div>
                    )}
                </div>
                <hr />

                <div className='flex gap-6'>
                    <div className='flex-1'>
                        <UnitChildren children={children} />
                    </div>
                    <div className='flex-1'>
                        {suggestedChildren.length > 0 && (
                            <UnitChildren
                                children={suggestedChildren}
                                afterUsed={(newUnit) => {
                                    setSuggestedChildren(
                                        suggestedChildren.filter(
                                            (child) => child.id !== newUnit.id
                                        )
                                    );
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className='bg-base-300 p-2 h-48 overflow-auto shrink-0'>
                <AugmentChatWindow
                    unit={suggestedUnit || unit}
                    children={suggestedChildren || children}
                    afterClarification={(clarifiedUnit) => {
                        setSuggestedUnit(clarifiedUnit.unit);
                        setSuggestedChildren(clarifiedUnit.children);
                    }}
                />
            </div>
        </div>
    );
}

function UnitAndChildren({
    unit,
    children,
}: {
    unit: UnitData;
    children: UnitData[];
}) {
    return (
        <div className='flex flex-col gap-6'>
            <div>
                <Unit
                    unit={unit}
                    className='bg-base-100 rounded border shadow'
                />
            </div>
            <div className='flex flex-col gap-2'>
                {children.map((child) => (
                    <Unit
                        key={child.id}
                        unit={child}
                        className='bg-base-200 rounded border shadow'
                    />
                ))}
            </div>
        </div>
    );
}

function StyledUnit({ unit }: { unit: UnitData }) {
    return <Unit unit={unit} className='bg-white rounded border shadow' />;
}

function UnitChildren({
    children,
    afterUsed,
}: {
    children: UnitData[];
    afterUsed?: (unit: UnitData) => void;
}) {
    const { addUnit } = useUnits();
    return (
        <div className='flex flex-col gap-2'>
            {children.map((child, index) => (
                <div key={index} className='relative scale-90'>
                    <Unit
                        unit={child}
                        className='bg-base-100 rounded border shadow'
                    />
                    <button
                        className='btn btn-xs btn-secondary absolute bottom-1 right-1'
                        onClick={() => {
                            addUnit(child);
                            afterUsed?.(child);
                        }}
                    >
                        USE THIS
                    </button>
                </div>
            ))}
        </div>
    );
}

function AugmentChatWindow({
    unit,
    children,
    afterClarification,
}: {
    unit: UnitData;
    children: UnitData[];
    afterClarification: ({
        unit,
        children,
    }: {
        unit: UnitData;
        children: UnitData[];
    }) => void;
}) {
    const [messages, setMessages] = useState<string[]>([]);
    const { register, handleSubmit, reset } = useForm();
    const { clarifyUnitAndChildren } = useAiAugmenter();
    const { units } = useUnits();

    const onSubmit = async (data: any) => {
        console.log(data); // Here you can handle the submitted data
        // For example, adding a new message:
        setMessages([...messages, data.message]);
        reset(); // Resets the form fields to initial values

        let clarifiedUnit = await clarifyUnitAndChildren(
            unit,
            children,
            units,
            data.message
        );
        afterClarification(clarifiedUnit);
    };

    return (
        <div className='flex gap-6'>
            <div className='border rounded p-2 overflow-y-scroll w-96 h-full'>
                {messages.map((message, i) => (
                    <div key={i}>{message}</div>
                ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='flex-1'>
                <div className='flex flex-col'>
                    <div>
                        <label className='block'>
                            What do you want to change?
                        </label>
                        <textarea
                            {...register('message', { required: true })}
                            className='w-full p-2 border rounded'
                        />
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex gap-2'>
                            <label htmlFor='augment-this'>Augment Unit</label>
                            <input
                                {...register('augment-this')}
                                type='checkbox'
                                id='augment-this'
                            />
                        </div>
                        <div className='flex gap-2'>
                            <label htmlFor='augment-children'>
                                Augment Children
                            </label>
                            <input
                                {...register('augment-children')}
                                type='checkbox'
                                id='augment-children'
                            />
                        </div>
                    </div>
                    <button type='submit' className='btn btn-primary'>
                        GO
                    </button>
                </div>
            </form>
        </div>
    );
}
