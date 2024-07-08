import React, { memo, useMemo } from 'react';

interface SvgIconProps {
    iconClass: string;
    fill?: string;
    fontSize?: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<SVGSVGElement>;
}

const svgStyle = {
    width: '1em',
    height: '1em',
    verticalAlign: '-0.15em',
    overflow: 'hidden',
    fill: 'currentColor', // 颜色值
    fontSize: '1.1em',
};

const SvgIcon = memo((props: SvgIconProps) => {
    const { iconClass, fill, fontSize, className, style, onClick } = props;

    const iconName = useMemo(() => '#icon-' + iconClass, [iconClass]);

    return (
        <svg
            fontSize={fontSize}
            style={{ ...svgStyle, fontSize, ...style }}
            aria-hidden={true}
            className={className}
            onClick={onClick}
        >
            <use xlinkHref={iconName} fill={fill} />
        </svg>
    );
});

export default SvgIcon;
