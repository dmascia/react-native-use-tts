export type SpeechPriority = 'low' | 'normal' | 'high' | 'interrupt';

export interface SpeakOptions {
  priority?: SpeechPriority;
}

export interface Telemetry {
  track: (event: string, data?: Record<string, unknown>) => void;
}
