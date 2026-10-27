# CHANGELOG

## 2.0.0

- BREAKING: Request and response interceptors are now awaited in order. Interceptors returning a Promise must resolve it, otherwise the request hangs
- Fix: Errors thrown by async interceptors are now passed to the error handler
- Upgrade `ask-sdk-core` to 2.14.0 and `ask-sdk-model` to 1.86.0
- Fix readme sample imports and interceptors, note that Alexa+ is not supported
- Upgrade typescript to 5.9.3
- Add unit tests and coverage using `vitest` (`npm test`, `npm run coverage`)

## 1.0.2

- Fix readme

## 1.0.1

- Add readme and changelog to npm

## 1.0.0

- Initial import
- Support for intents, session ended, error handler, and launch request
- Support for default intent handler
- Support for event, context, and callback
- Support for post constructor
- Support for request and response interceptors
