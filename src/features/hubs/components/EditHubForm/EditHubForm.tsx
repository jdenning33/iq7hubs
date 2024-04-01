'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { HubData, useHubs } from '../../hooks/useHubs';

export const EditHubForm = ({
    afterSubmit,
}: {
    afterSubmit: (hubData: HubData) => void;
}) => {
    const { register, handleSubmit, reset } = useForm<HubData>();
    const { createHub } = useHubs();

    const onSubmit = (data: any) => {
        let newHub = createHub({ ...data });
        reset(); // Reset form fields
        afterSubmit(newHub); // Close the modal
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='form-control w-full p-2'
        >
            <div className='flex flex-col gap-2'>
                <label className='input input-bordered flex items-center gap-2'>
                    Name
                    <input
                        id='hubName'
                        {...register('hubName', { required: true })}
                    />
                </label>

                <label className='input input-bordered flex items-center gap-2'>
                    Description
                    <input
                        id='description'
                        {...register('description', { required: true })}
                    />
                </label>
            </div>
            <button className='btn btn-primary mt-4' type='submit'>
                Add Hub
            </button>
        </form>
    );
};
