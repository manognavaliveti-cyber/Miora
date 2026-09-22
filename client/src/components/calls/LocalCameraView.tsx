import React, { useEffect, useRef, useState } from 'react';
import { CameraOff, RefreshCw } from 'lucide-react';

type CamState = 'requesting' | 'live' | 'denied' | 'unavailable' | 'insecure';

interface LocalCameraViewProps {
  /** true = the user switched their camera off in the call controls */
  cameraOff: boolean;
  /** true = selfie camera, false = back camera */
  frontCamera: boolean;
  /** shown while the camera is starting / blocked / off */
  fallbackPhoto: string;
  name: string;
}

/**
 * Real camera preview for the "You" picture-in-picture of a video call.
 * Asks the browser for camera access, shows the live feed, and reacts to the
 * camera on/off and switch-camera buttons. The camera is always released when the
 * call ends (the component unmounts) or the camera is switched off.
 */
export const LocalCameraView: React.FC<LocalCameraViewProps> = ({ cameraOff, frontCamera, fallbackPhoto, name }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CamState>('requesting');
  const [attempt, setAttempt] = useState(0);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => {
    if (cameraOff) {
      stopStream();
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setState(window.isSecureContext === false ? 'insecure' : 'unavailable');
      return;
    }

    let cancelled = false;
    setState('requesting');

    const start = async () => {
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: frontCamera ? 'user' : 'environment' } },
            audio: false
          });
        } catch (firstErr: any) {
          // Permission problems are final; anything else (no such facing mode, etc.) → try any camera.
          if (firstErr && (firstErr.name === 'NotAllowedError' || firstErr.name === 'SecurityError')) throw firstErr;
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          try {
            await video.play();
          } catch {
            /* autoplay is fine — muted + playsInline is set */
          }
        }
        setState('live');
      } catch (err: any) {
        if (cancelled) return;
        const n = err?.name || '';
        if (n === 'NotAllowedError' || n === 'PermissionDeniedError' || n === 'SecurityError') setState('denied');
        else setState('unavailable');
      }
    };

    start();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [cameraOff, frontCamera, attempt]);

  const showLive = !cameraOff && state === 'live';

  const message =
    state === 'denied'
      ? 'Camera blocked'
      : state === 'insecure'
      ? 'Camera needs HTTPS'
      : state === 'unavailable'
      ? 'No camera found'
      : 'Starting camera…';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#1F161A' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: showLive ? 'block' : 'none',
          // mirror the selfie camera like every video-call app does
          transform: frontCamera ? 'scaleX(-1)' : 'none'
        }}
      />

      {!showLive && (
        <>
          <img
            src={fallbackPhoto}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(1) brightness(0.35)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              textAlign: 'center',
              color: '#FFFFFF'
            }}
          >
            {cameraOff ? (
              <>
                <CameraOff size={22} />
                <span style={{ fontSize: '0.66rem', fontWeight: 700 }}>Camera off</span>
              </>
            ) : (
              <>
                {state !== 'requesting' && <CameraOff size={22} />}
                <span style={{ fontSize: '0.66rem', fontWeight: 700 }}>{message}</span>
                {state === 'denied' && (
                  <span style={{ fontSize: '0.58rem', opacity: 0.8, lineHeight: 1.25 }}>
                    Allow camera for this site in your browser settings, then tap Retry
                  </span>
                )}
                {(state === 'denied' || state === 'unavailable') && (
                  <button
                    type="button"
                    onClick={() => setAttempt((a) => a + 1)}
                    style={{
                      marginTop: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: 'none',
                      borderRadius: '999px',
                      background: 'var(--primary-gradient)',
                      color: '#FFFFFF',
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      padding: '5px 10px',
                      cursor: 'pointer'
                    }}
                  >
                    <RefreshCw size={11} /> Retry
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
