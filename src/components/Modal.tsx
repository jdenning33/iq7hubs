import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import '@mdxeditor/editor/style.css';

const Modal = ({
    title,
    isOpen,
    onClose,
    size = 'md',
    children,
}: {
    title: string;
    isOpen: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'fit';
    onClose: () => void;
    children: React.ReactNode;
}) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-30' />

                <Dialog.Content
                    className='fixed inset-0 flex items-center justify-center p-4 z-40 '
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded bg-white p-2 relative flex flex-col max-h-[95vh] ${
                            size === 'sm'
                                ? 'w-[20rem]'
                                : size === 'md'
                                ? 'w-[30rem]'
                                : size === 'lg'
                                ? 'w-[40rem]'
                                : size === 'xl'
                                ? 'w-[50rem]'
                                : size === 'fit'
                                ? 'w-auto'
                                : 'w-[30rem]'
                        }`}
                    >
                        <Dialog.Close className='btn btn-sm btn-ghost btn-circle absolute top-1 right-1'>
                            X
                        </Dialog.Close>
                        <h3 className='text-lg font-medium p-2'>{title}</h3>
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Modal;
