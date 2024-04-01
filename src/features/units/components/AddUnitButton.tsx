'use client';

import React, { ReactNode, useState } from 'react';
import Modal from '@/components/Modal'; // Adjust the import path as necessary
import EditUnitForm from './EditUnitForm'; // Adjust the import path as necessary
import { UnitData, useUnits } from '../hooks/useUnits'; // Adjust the import path as necessary

interface AddUnitButtonProps {
    className?: string;
    parentId?: string | null; // Optional, allowing to add a root unit or a child unit
    initiativeId: string;
    children?: ReactNode;
    afterUnitAdded?: (unit: UnitData) => void; // Optional callback after unit is added
}

export const AddUnitButton: React.FC<AddUnitButtonProps> = ({
    className,
    parentId = null,
    initiativeId,
    children,
    afterUnitAdded,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addUnit } = useUnits();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Blank unit template for the form
    const blankUnit: Omit<UnitData, 'id'> & Partial<UnitData> = {
        description: '',
        order: 0,
        parentId,
        initiativeId,
    };

    function addNewUnit() {
        let newUnit = addUnit(blankUnit);
        afterUnitAdded?.(newUnit);
    }

    return (
        <div>
            {children ? (
                <div onClick={addNewUnit} className={className}>
                    {children}
                </div>
            ) : (
                <button
                    className={'btn btn-sm btn-outline rounded ' + className}
                    onClick={addNewUnit}
                >
                    Add New Unit
                </button>
            )}
            <Modal
                title='Add New Unit'
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                <EditUnitForm
                    initialData={blankUnit}
                    afterSubmit={(updatedUnit) => {
                        console.log('Unit added:', updatedUnit);
                        afterUnitAdded?.(updatedUnit);
                        closeModal();
                    }}
                />
            </Modal>
        </div>
    );
};
