'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UnitData, useUnits } from '../hooks/useUnits'; // Adjust the import path as necessary
// import { MarkdownEditor } from '@/components/MarkdownEditor/MarkdownEditor';

interface EditUnitFormProps {
    initialData: UnitData | (Omit<UnitData, 'id'> & Partial<UnitData>);
    afterSubmit: (unit: UnitData) => void; // Function to call after form submission, e.g., to close the form
}

function EditUnitForm({ initialData, afterSubmit }: EditUnitFormProps) {
    const { register, handleSubmit, reset } = useForm<UnitData>({
        defaultValues: initialData || {
            title: '',
            description: '',
            parentId: null,
        },
    });
    const { addUnit, updateUnit } = useUnits();

    const onSubmit = (data: UnitData) => {
        let updatedUnit = {
            ...data,
            //description: content,
        };
        if (initialData.id) {
            // We're editing an existing unit
            updatedUnit = updateUnit(updatedUnit);
        } else {
            // We're adding a new unit
            updatedUnit = addUnit(updatedUnit);
        }
        reset(); // Reset form fields
        afterSubmit(updatedUnit); // Call the afterSubmit function, which might close the modal
    };

    const [content, setContent] = useState(initialData?.description || '');

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='form-control w-full p-4'
        >
            <div className='mb-4'>
                {/* <MarkdownEditor markdown={content} onChange={setContent} /> */}
                <textarea
                    id='description'
                    {...register('description')}
                    className='textarea textarea-bordered w-full'
                />
            </div>
            <button type='submit' className='btn btn-primary'>
                {initialData ? 'Update Unit' : 'Add Unit'}
            </button>
        </form>
    );
}

export default EditUnitForm;
