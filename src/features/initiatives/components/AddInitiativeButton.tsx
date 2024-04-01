'use client';

import Modal from '@/components/Modal';
import React, { useState } from 'react';
import EditInitiativeForm from './EditInitiativeForm';

export const AddInitiativeButton = ({ hubId }: { hubId: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // An example of a blank initiative data structure, adjust according to your actual data model
    const blankInitiative = {
        hubId: hubId, // You might want to set this based on some selection or user input
        title: '',
        description: '',
    };

    return (
        <div>
            <button className='btn btn-sm btn-primary' onClick={openModal}>
                Add New Initiative
            </button>
            <Modal
                title='Add New Initiative'
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                {/* Pass the blankInitiative as initialData for creating a new initiative */}
                <EditInitiativeForm
                    initialData={blankInitiative}
                    afterSubmit={(_) => closeModal()}
                />
            </Modal>
        </div>
    );
};
