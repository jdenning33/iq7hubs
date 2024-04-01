'use client';
// InitializedMDXEditor.tsx
import type { ForwardedRef } from 'react';
import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    codeBlockPlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    BoldItalicUnderlineToggles,
    ListsToggle,
    BlockTypeSelect,
    UndoRedo,
    CodeToggle,
    toolbarPlugin,
    InsertCodeBlock,
    SandpackConfig,
    sandpackPlugin,
    codeMirrorPlugin,
    InsertSandpack,
    ConditionalContents,
    ChangeCodeMirrorLanguage,
} from '@mdxeditor/editor';

// Only import this to the next file
export default function InitializedMDXEditor({
    editorRef,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
    return (
        <MDXEditor
            plugins={[
                // Example Plugin Usage
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <ConditionalContents
                            options={[
                                {
                                    when: (editor) =>
                                        editor?.editorType === 'codeblock',
                                    contents: () => (
                                        <ChangeCodeMirrorLanguage />
                                    ),
                                },
                                {
                                    fallback: () => (
                                        <>
                                            <BoldItalicUnderlineToggles />
                                            <ListsToggle />
                                            <BlockTypeSelect />
                                            <CodeToggle />
                                            <InsertCodeBlock />
                                            <div className='flex-1'></div>
                                            <UndoRedo />
                                        </>
                                    ),
                                },
                            ]}
                        />
                    ),
                }),
            ]}
            {...props}
            ref={editorRef}
        />
    );
}
