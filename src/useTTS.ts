import { useCallback, useEffect, useRef, useState } from 'react';
import Tts from 'react-native-tts';
import { SpeechQueue } from './SpeechQueue';
import { SpeakOptions, Telemetry } from './types';
import { noopTelemetry } from './telemetry';

export function useTTS({ telemetry = noopTelemetry }: { telemetry?: Telemetry } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const queueRef = useRef(new SpeechQueue());
  const readyResolveRef = useRef<(() => void) | null>(null);
  const readyPromiseRef = useRef<Promise<void> | null>(null);
  const initializedRef = useRef(false);

  const resolveReady = () => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setIsInitialized(true);
    readyResolveRef.current?.();
  };

  useEffect(() => {
    readyPromiseRef.current = new Promise(resolve => {
      readyResolveRef.current = resolve;
    });

    const onFinish = async () => {
      setIsSpeaking(false);
      const next = queueRef.current.dequeue();
      if (next) await speakInternal(next.text);
    };

    Tts.addEventListener('tts-start', () => setIsSpeaking(true));
    Tts.addEventListener('tts-finish', onFinish);
    Tts.addEventListener('tts-cancel', () => setIsSpeaking(false));

    const init = async () => {
      try {
        await Tts.getInitStatus();
        await Tts.setDefaultRate(0.7, true);
      } finally {
        resolveReady();
      }
    };

    init();

    return () => {
      Tts.removeEventListener('tts-finish', onFinish);
    };
  }, []);

  const ready = useCallback(() => readyPromiseRef.current ?? Promise.resolve(), []);

  const speakInternal = async (text: string) => {
    telemetry.track('tts_speak_start', { textLength: text.length });
    await Tts.stop();
    await Tts.speak(text);
  };

  const speak = useCallback(
    async (text: string, options: SpeakOptions = {}) => {
      if (!text.trim()) return;
      await ready();

      const priority = options.priority ?? 'normal';

      if (priority === 'interrupt') {
        queueRef.current.clear();
        await speakInternal(text);
        return;
      }

      if (isSpeaking) {
        queueRef.current.enqueue(text, priority);
        telemetry.track('tts_queued', { priority });
      } else {
        await speakInternal(text);
      }
    },
    [isSpeaking, ready],
  );

  const stop = useCallback(async () => {
    queueRef.current.clear();
    await Tts.stop();
    setIsSpeaking(false);
    telemetry.track('tts_stopped');
  }, []);

  return { speak, stop, ready, isSpeaking, isInitialized };
}
