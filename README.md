# react-native-use-tts

A **production-ready React Native Text-to-Speech (TTS) hook** with TypeScript, queueing, priorities, and telemetry. Designed for **scalable, maintainable, and testable TTS usage** in professional React Native projects.

---

## Features

- ✅ Deterministic async readiness (`ready()` promise)
- ✅ Speech queue with priorities (`low`, `normal`, `high`, `interrupt`)
- ✅ Interrupt and clear queue functionality
- ✅ Telemetry hooks for Datadog, Segment, or custom analytics
- ✅ Fully typed with TypeScript
- ✅ Handles Flow syntax in React Native dependencies
- ✅ NPM-publishable and tree-shakable

---

## Installation

```bash
yarn add react-native-use-tts react-native-tts
```

---

## Usage

```ts
import { useTTS } from 'react-native-use-tts';

const MyComponent = () => {
  const { speak, stop, ready, isSpeaking } = useTTS({ telemetry });

  const sayHello = async () => {
    await ready();
    speak('Hello world!', { priority: 'high' });
  };

  return (
    <Button title="Speak" onPress={sayHello} />
  );
};
```

### API

| Function / Property | Type | Description |
|--------------------|------|-------------|
| `speak(text, options?)` | `(string, SpeakOptions?) => Promise<void>` | Speak text with optional priority. |
| `stop()` | `() => Promise<void>` | Immediately stops speech and clears the queue. |
| `ready()` | `() => Promise<void>` | Resolves when TTS is initialized and ready. |
| `isSpeaking` | `boolean` | True if TTS is currently speaking. |
| `isInitialized` | `boolean` | True once TTS has initialized. |

### SpeakOptions
```ts
interface SpeakOptions {
  priority?: 'low' | 'normal' | 'high' | 'interrupt';
}
```

### Telemetry
```ts
interface Telemetry {
  track: (event: string, data?: Record<string, unknown>) => void;
}
```
- `telemetry` is optional; defaults to a no-op if not provided.

---

## Architecture Notes

- **Design**: deterministic initialization, queueing, priority system, telemetry hooks.
- **Operational readiness**: Warm-up, stop handling, safe no-crash behavior.
- **Extensible**: can integrate with any telemetry system or extend queue logic for more complex UX.

---

## Contribution

1. Fork the repository.
2. Create a new feature branch.
3. Write tests and ensure existing tests pass.
4. Submit a pull request.

---

## License
MIT
