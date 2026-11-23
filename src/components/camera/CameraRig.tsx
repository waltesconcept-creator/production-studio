import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface CameraRigProps {
  children: React.ReactNode;
  panX?: [number, number]; // [startPanX, endPanX] in px
  panY?: [number, number]; // [startPanY, endPanY] in px
  zoom?: [number, number]; // [startZoom, endZoom] scale factor e.g. [1.0, 1.15]
  tilt?: [number, number]; // [startTilt, endTilt] in degrees
  perspective?: number; // 3D perspective in px
  rotateX?: [number, number]; // 3D tilt up/down
  rotateY?: [number, number]; // 3D tilt left/right
  shake?: boolean;
  shakeIntensity?: number;
  durationInFrames?: number;
  style?: React.CSSProperties;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  children,
  panX = [0, 0],
  panY = [0, 0],
  zoom = [1, 1.05],
  tilt = [0, 0],
  perspective = 1000,
  rotateX = [0, 0],
  rotateY = [0, 0],
  shake = false,
  shakeIntensity = 2,
  durationInFrames = 90,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const currentPanX = interpolate(frame, [0, durationInFrames], panX, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentPanY = interpolate(frame, [0, durationInFrames], panY, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentZoom = interpolate(frame, [0, durationInFrames], zoom, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentTilt = interpolate(frame, [0, durationInFrames], tilt, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentRotX = interpolate(frame, [0, durationInFrames], rotateX, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentRotY = interpolate(frame, [0, durationInFrames], rotateY, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Handheld organic camera shake
  const shakeX = shake ? (Math.sin(frame * 0.45) + Math.cos(frame * 0.8)) * shakeIntensity : 0;
  const shakeY = shake ? (Math.cos(frame * 0.35) + Math.sin(frame * 0.7)) * shakeIntensity : 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        perspective: `${perspective}px`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `
            translate3d(${currentPanX + shakeX}px, ${currentPanY + shakeY}px, 0px)
            scale(${currentZoom})
            rotate(${currentTilt}deg)
            rotateX(${currentRotX}deg)
            rotateY(${currentRotY}deg)
          `,
          transformOrigin: 'center center',
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};
