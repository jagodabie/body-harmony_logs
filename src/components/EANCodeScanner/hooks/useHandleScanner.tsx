import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
import type { Result } from '@zxing/library';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

import { CAMERA_LABELS, EAN_REGEX, ERROR_MESSAGES,VIDEO_CONSTRAINTS } from '../constants';

export const useHandleScanner = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async() => {
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        const cams = list.filter((d) => d.kind === 'videoinput');
        if (!mounted) return;
        setDevices(cams);
        const back = cams.find((c) => CAMERA_LABELS.BACK_PATTERN.test(c.label));
        setDeviceId(back?.deviceId || cams[0]?.deviceId);
      } catch (e) {
        console.debug('enumerateDevices failed', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const start = async() => {
    if (!videoRef.current) return;
    setError(null);
    setLastCode(null);

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    try {
      const reader = new BrowserMultiFormatReader(hints);

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { 
              deviceId: { exact: deviceId }, 
              width: VIDEO_CONSTRAINTS.WIDTH, 
              height: VIDEO_CONSTRAINTS.HEIGHT, 
              aspectRatio: VIDEO_CONSTRAINTS.ASPECT_RATIO 
            }
          : { 
              facingMode: { ideal: 'environment' }, 
              width: VIDEO_CONSTRAINTS.WIDTH, 
              height: VIDEO_CONSTRAINTS.HEIGHT, 
              aspectRatio: VIDEO_CONSTRAINTS.ASPECT_RATIO 
            },
        audio: false,
      };

      const controls = await reader.decodeFromConstraints(
        constraints,
        videoRef.current,
        (result: Result | undefined) => {
          if (result) {
            const text = result.getText();
            if (EAN_REGEX.test(text)) {
              setLastCode(text);
              stop();
            }
          }
        }
      );

      try {
        const stream = videoRef.current.srcObject as MediaStream | null;
        const track = stream?.getVideoTracks?.()[0];
        const caps = track?.getCapabilities?.();
        if (caps?.torch as boolean) {
          setTorchAvailable(true);
        } else {
          setTorchAvailable(false);
        }
      } catch (e) {
        console.error('Error checking torch capabilities', e);
      }

      try {
        const listAfter = await navigator.mediaDevices.enumerateDevices();
        const camsAfter = listAfter.filter((d) => d.kind === 'videoinput');
        setDevices(camsAfter);
      } catch (e) {
        console.error('Error refreshing device list', e);
      }

      controlsRef.current = controls;
      setActive(true);
    } catch (e) {
      console.error('Error starting scanner', e);
      const error = e as Error;
      setError(error.message || ERROR_MESSAGES.SCANNER_START);
    }
  };

  const toggleTorch = async() => {
    try {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      const track = stream?.getVideoTracks?.()[0];
      if (!track) return;
      const caps = track.getCapabilities?.() as MediaTrackCapabilities;
      if (!caps?.torch) return;
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((v) => !v);
    } catch (e) {
      console.debug('Torch toggle failed', e);
    }
  };

  const stop = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setActive(false);

    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => () => stop(), []);

  return {
    videoRef,
    devices,
    deviceId,
    setDeviceId,
    active,
    error,
    lastCode,
    torchAvailable,
    torchOn,
    start,
    toggleTorch,
    stop,
  };
};
