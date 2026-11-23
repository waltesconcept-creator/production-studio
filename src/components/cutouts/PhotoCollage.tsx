import React from 'react';
import { CutoutImage, CutoutImageProps } from './CutoutImage';

export interface CollageItem extends CutoutImageProps {
  id: string;
  x: number | string; // e.g. '20%' or 250
  y: number | string; // e.g. '30%' or 300
}

export interface PhotoCollageProps {
  items: CollageItem[];
  containerWidth?: number | string;
  containerHeight?: number | string;
  style?: React.CSSProperties;
}

export const PhotoCollage: React.FC<PhotoCollageProps> = ({
  items,
  containerWidth = '100%',
  containerHeight = '100%',
  style = {},
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: containerWidth,
        height: containerHeight,
        overflow: 'visible',
        ...style,
      }}
    >
      {items.map((item, index) => {
        const { id, x, y, delay, ...imageProps } = item;
        return (
          <div
            key={id || index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CutoutImage
              delay={delay !== undefined ? delay : index * 8}
              {...imageProps}
            />
          </div>
        );
      })}
    </div>
  );
};
