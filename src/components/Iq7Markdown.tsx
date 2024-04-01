import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Iq7Markdown({ children }: { children: string }) {
    return (
        <div className=''>
            <Markdown remarkPlugins={[remarkGfm]}>{children}</Markdown>
        </div>
    );
}
