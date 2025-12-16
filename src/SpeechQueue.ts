import { SpeakOptions, SpeechPriority } from './types';

interface SpeechItem {
  text: string;
  priority: SpeechPriority;
}

const PRIORITY_ORDER: SpeechPriority[] = ['interrupt', 'high', 'normal', 'low'];

export class SpeechQueue {
  private queue: SpeechItem[] = [];

  enqueue(text: string, priority: SpeechPriority) {
    this.queue.push({ text, priority });
    this.queue.sort(
      (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority),
    );
  }

  dequeue(): SpeechItem | undefined {
    return this.queue.shift();
  }

  clear() {
    this.queue = [];
  }

  get size() {
    return this.queue.length;
  }
}
