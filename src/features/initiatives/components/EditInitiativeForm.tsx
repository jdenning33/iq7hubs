'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { InitiativeData, useInitiatives } from '../hooks/useInitiatives';

const EditInitiativeForm = ({
    initialData,
    afterSubmit,
}: {
    initialData: InitiativeData | Omit<InitiativeData, 'id'>;
    afterSubmit: (initiativeData: InitiativeData) => void;
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InitiativeData>({
        defaultValues: initialData,
    });
    const { updateInitiative, addInitiative } = useInitiatives();

    const onSubmit = (data: InitiativeData) => {
        let updatedInitiative = data.id
            ? updateInitiative({ ...data })
            : addInitiative({ ...data });
        console.log('updatedInitiative', updatedInitiative);
        reset(); // Optional: Reset form fields if needed
        afterSubmit(updatedInitiative); // Perform after-submit actions, e.g., close the modal
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='form-control w-full p-4'
        >
            <div className='flex flex-col gap-4'>
                <div>
                    <label htmlFor='title' className='label'>
                        Title
                    </label>
                    <input
                        id='title'
                        type='text'
                        {...register('title', {
                            required: 'Title is required',
                        })}
                        className={`input input-bordered w-full ${
                            errors.title ? 'input-error' : ''
                        }`}
                    />
                    {errors.title && (
                        <p className='text-error'>{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor='description' className='label'>
                        Description
                    </label>
                    <textarea
                        id='description'
                        {...register('description')}
                        className='textarea textarea-bordered w-full'
                    />
                </div>
            </div>
            <button className='btn btn-primary mt-4' type='submit'>
                Save Changes
            </button>
        </form>
    );
};

export default EditInitiativeForm;
