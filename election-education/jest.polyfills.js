// jest.polyfills.js
const { TextDecoder, TextEncoder } = require('node:util');
const { ReadableStream, TransformStream, WritableStream } = require('node:stream/web');
const { MessageChannel, MessagePort, BroadcastChannel } = require('node:worker_threads');

// Polyfill TextEncoder/TextDecoder
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder, writable: true, configurable: true },
  TextEncoder: { value: TextEncoder, writable: true, configurable: true },
  ReadableStream: { value: ReadableStream, writable: true, configurable: true },
  TransformStream: { value: TransformStream, writable: true, configurable: true },
  WritableStream: { value: WritableStream, writable: true, configurable: true },
  MessageChannel: { value: MessageChannel, writable: true, configurable: true },
  MessagePort: { value: MessagePort, writable: true, configurable: true },
  BroadcastChannel: { value: BroadcastChannel, writable: true, configurable: true },
});

// Polyfill fetch, Request, Response, Headers using undici
const { fetch, Request, Response, Headers } = require('undici');

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true, configurable: true },
  Request: { value: Request, writable: true, configurable: true },
  Response: { value: Response, writable: true, configurable: true },
  Headers: { value: Headers, writable: true, configurable: true },
});
