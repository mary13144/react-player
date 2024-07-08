import { memo, useContext, useMemo, useState } from 'react';
import styles from './index.module.scss';
import { VideoContext } from '@/core/context';
import useToast from '@/components/toast/useToast.ts';
import { i18n } from '@/language';
import { LanguageType } from '@/types';

interface QualityProps {
    theme: string;
    language: LanguageType;
}

const Quality = memo((props: QualityProps) => {
    const { language, theme } = props;

    const { videoMethod, videoOption, videoAttributes } =
        useContext(VideoContext);

    const { qualityConfig, isShowToast, toastPosition } = videoOption!;

    const { seek, setVideoSrc, pause, play } = videoMethod!;

    const { currentKey, qualityList } = qualityConfig!;

    const { currentTime, isPlay } = videoAttributes!;

    const [isShow, setIsShow] = useState<boolean>(false);

    const qualitySelected = useMemo(() => {
        const curQuality = qualityList.find((item) => {
            return item.key === currentKey;
        });
        return language === 'zh' ? curQuality?.zhName : curQuality?.enName;
    }, [currentKey]);

    const { showToast } = useToast();

    const handleChangeQuality = (key: number) => {
        const curQuality = qualityList.find((item) => {
            return key === item.key;
        })!;
        qualityConfig!.currentKey = key;
        setVideoSrc(curQuality.url);
        seek(currentTime);
        if (isPlay) {
            play();
        } else {
            pause();
        }
        isShowToast !== false &&
            showToast({
                message: (
                    <div>
                        {i18n(language, 'qualitySwitch')}&nbsp;
                        <strong style={{ color: theme }}>
                            {language === 'zh'
                                ? curQuality.zhName
                                : curQuality.enName}
                        </strong>
                    </div>
                ),
                position: toastPosition,
            });
    };

    const handleMoveEnter = () => {
        setIsShow(true);
    };

    const handleMoveLeave = () => {
        setIsShow(false);
    };

    return (
        <div
            className={styles.qualityContainer}
            onMouseEnter={handleMoveEnter}
            onMouseLeave={handleMoveLeave}
        >
            <div className={styles.qualityText}>{qualitySelected}</div>
            <div
                className={styles.qualitySelectContainer}
                style={{
                    opacity: isShow ? '1' : '0',
                    visibility: isShow ? 'visible' : 'hidden',
                }}
            >
                {qualityList && qualityList.length > 1 ? (
                    <ul className={styles.qualitySelectList}>
                        {qualityList.map((item) => {
                            return (
                                <li
                                    key={item.key}
                                    onClick={() =>
                                        handleChangeQuality(item.key)
                                    }
                                    className={styles.qualitySelectItem}
                                    style={{
                                        color:
                                            item.key === currentKey
                                                ? theme
                                                : 'rgba(256, 256, 256, 0.7)',
                                    }}
                                >
                                    {language === 'zh'
                                        ? item.zhName
                                        : item.enName}
                                </li>
                            );
                        })}
                    </ul>
                ) : null}
            </div>
        </div>
    );
});

export default Quality;
