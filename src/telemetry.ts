import { Telemetry } from './types';

export const noopTelemetry: Telemetry = {
  track: () => {},
};
