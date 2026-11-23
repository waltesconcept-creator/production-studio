import React from 'react';

export interface TornPaperHeaderProps {
  color?: string; // e.g. #ff5500 (orange) or #dc2626 (red)
  height?: number | string;
  children?: React.ReactNode;
  ripPosition?: 'bottom' | 'top';
  style?: React.CSSProperties;
}

export const TornPaperHeader: React.FC<TornPaperHeaderProps> = ({
  color = '#ff5500',
  height = '32%',
  children,
  ripPosition = 'bottom',
  style = {},
}) => {
  const clipBottom = `polygon(
    0% 0%,
    100% 0%,
    100% calc(100% - 18px),
    96% calc(100% - 8px),
    92% calc(100% - 22px),
    87% calc(100% - 6px),
    82% calc(100% - 20px),
    77% calc(100% - 9px),
    72% calc(100% - 24px),
    67% calc(100% - 7px),
    61% calc(100% - 19px),
    55% calc(100% - 10px),
    49% calc(100% - 26px),
    43% calc(100% - 8px),
    37% calc(100% - 22px),
    31% calc(100% - 6px),
    25% calc(100% - 20px),
    19% calc(100% - 9px),
    13% calc(100% - 23px),
    7% calc(100% - 8px),
    0% calc(100% - 16px)
  )`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height,
        backgroundColor: color,
        clipPath: clipBottom,
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
