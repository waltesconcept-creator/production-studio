import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface GridOverlayProps {
  showCrosshairs?: boolean;
  showCoordinates?: boolean;
  showTimecode?: boolean;
  color?: string;
  opacity?: number;
  label?: string;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({
  showCrosshairs = true,
  showCoordinates = true,
  showTimecode = true,
  color = '#ffffff',
  opacity = 0.25,
  label = 'SYS_REC // 24FPS',
}) => {
  const frame = useCurrentFrame();

  const seconds = Math.floor(frame / 30);
  const framesRem = frame % 30;
  const timecode = `00:00:${seconds.toString().padStart(2, '0')}:${framesRem.toString().padStart(2, '0')}`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: '24px',
        pointerEvents: 'none',
        zIndex: 5,
        opacity,
        fontFamily: '"Chakra Petch", "Courier New", monospace',
        fontSize: '11px',
        color,
        letterSpacing: '0.12em',
      }}
    >
      {/* 4 Corner Crosshairs */}
      {showCrosshairs && (
        <>
          {/* Top Left */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '16px', height: '16px', borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
          {/* Top Right */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '16px', height: '16px', borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
          {/* Bottom Left */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '16px', height: '16px', borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
          {/* Bottom Right */}
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
        </>
      )}

      {/* Top info */}
      <div style={{ position: 'absolute', top: 0, left: '24px' }}>
        {label}
      </div>

      {showTimecode && (
        <div style={{ position: 'absolute', top: 0, right: '24px' }}>
          TC: {timecode}
        </div>
      )}

      {/* Bottom Coordinates */}
      {showCoordinates && (
        <div style={{ position: 'absolute', bottom: 0, left: '24px' }}>
          LAT: 37°46'N // LONG: 122°25'W
        </div>
      )}
    </div>
  );
};
