import { createRoot, Root } from 'react-dom/client';
import Toast, { ToastProps } from '@/components/toast/index.tsx';
import { useRef } from 'react';

interface ToastOptions extends ToastProps {
    duration?: number;
}

const useToast = () => {
    const timer = useRef<NodeJS.Timeout | undefined>();
    const rootRef = useRef<Root | null>(null);

    const showToast = (option: ToastOptions) => {
        if (timer) {
            clearTimeout(timer.current);
            closeToast();
        }
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        const videoContainer = document.getElementById('video-container');
        videoContainer?.appendChild(toastContainer);
        const root = createRoot(toastContainer);
        root.render(
            Toast({ message: option.message, position: option.position }),
        );
        rootRef.current = root;
        timer.current = setTimeout(closeToast, option.duration || 2000);
    };

    const closeToast = () => {
        rootRef.current?.unmount();
        const videoContainer = document.getElementById('toast-container');
        videoContainer?.remove();
    };

    return {
        showToast,
    };
};

export default useToast;
