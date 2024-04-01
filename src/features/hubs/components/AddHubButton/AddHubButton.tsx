'use client';

import Modal from '@/components/Modal';
import React, { useState } from 'react';
import { EditHubForm } from '../EditHubForm/EditHubForm';

export const AddHubButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <button className='btn btn-sm btn-primary' onClick={openModal}>
                Add New Hub
            </button>
            <Modal
                title='Add New Hub'
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                <EditHubForm afterSubmit={(_) => closeModal()} />
            </Modal>
        </div>
    );
};
