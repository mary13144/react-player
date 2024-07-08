import { memo, PropsWithChildren, useState } from 'react';
import styles from './index.module.scss';

interface ToolTipProps extends PropsWithChildren {
    text: string;
}

const ToolTip = memo((props: ToolTipProps) => {
    const { text, children } = props;

    const [isShow, setIsShow] = useState<boolean>(false);

    const handleMouseEnter = () => {
        setIsShow(true);
    };

    const handleMouseLeave = () => {
        setIsShow(false);
    };
    return (
        <div className={styles.toolTipContainer}>
            <div
                className={styles.toolTipText}
                style={{
                    opacity: isShow ? '1' : '0',
                    visibility: isShow ? 'visible' : 'hidden',
                }}
            >
                {text}
            </div>
            <div
                className={styles.toolTipIcon}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
        </div>
    );
});

export default ToolTip;
