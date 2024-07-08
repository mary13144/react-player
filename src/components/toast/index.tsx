import { ReactNode } from 'react';

import { defaultToastPosition } from '@/core/config';
import './index.scss';

export interface ToastProps {
    message: ReactNode;
    position?: ToastPosition;
}

/**
 * @description toast位置
 */
export type ToastPosition =
    | 'leftTop'
    | 'rightTop'
    | 'leftBottom'
    | 'rightBottom'
    | 'center';

const Toast = (props: ToastProps) => {
    const { message, position } = props;

    return (
        <div
            className={`${position || defaultToastPosition} toast`}
            id={`toast`}
        >
            {message}
        </div>
    );
};

export default Toast;
