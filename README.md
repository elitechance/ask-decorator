# ASK-DECORATOR

Typescript decorators for ASK SDK v2 for Node.js

> **Note:** This library targets classic Alexa custom skills built on the [Alexa Skills Kit](https://developer.amazon.com/docs/alexa-skills-kit-sdk-for-nodejs/overview.html). It does not support Alexa+, which uses the [Alexa AI SDKs](https://developer.amazon.com/en-US/blogs/alexa/alexa-skills-kit/2025/02/new-alexa-announce-blog) instead. Existing custom skills keep working on original Alexa.

## Sample Usage

```typescript
import {
  Intent,
  LaunchRequest,
  AskDecorator,
  SessionEndedRequest,
  DefaultIntentHandler,
  Event,
  Callback,
  Context,
  PostConstructor,
  RequestInterceptor,
  ResponseInterceptor
} from 'ask-decorator';
import { HandlerInput } from 'ask-sdk-core';

export class AlexaLambda {
  /**
   * Lambda event
   */
  @Event() event;

  /**
   * Lambda callback
   */
  @Callback() callback;

  /**
   * Lambda context
   */
  @Context() context;

  /**
   * Post constructor, event, context, and callback will be available
   */
  @PostConstructor()
  PostConstructor() {
    console.log('event', this.event);
    console.log('context', this.context);
    console.log('callback', this.callback);
  }

  /**
   * Manage CustomIntent
   */
  @Intent('CustomIntent')
  handleCustomIntent(handler: HandlerInput) {
    return handler.responseBuilder
      .speak('Custom intent response')
      .getResponse();
  }

  /**
   * Manage multiple intents in one function
   */
  @Intent(['Custom1Intent', 'Custom2Intent'])
  handleMultiIntent(handler: HandlerInput) {
    return handler.responseBuilder
      .speak('Manage both Custom1Intent and Custom2Intent')
      .getResponse();
  }

  /**
   *
   * Manage launch request
   */
  @LaunchRequest()
  handleLaunchRequest(handler: HandlerInput) {
    return handler.responseBuilder.speak('open this app').getResponse();
  }

  /**
   *
   * Manage end session
   */
  @SessionEndedRequest()
  handlerSessionEndRequest(handler: HandlerInput) {
    return handler.responseBuilder.speak('session ended').getResponse();
  }

  /**
   * Manage intent without handler
   */
  @DefaultIntentHandler()
  DefaultIntentHandler(handler: HandlerInput) {
    return handler.responseBuilder.speak('default handler').getResponse();
  }

  /**
   * Interceptors run in order and may be async; each one is awaited
   */
  @ResponseInterceptor()
  async responseInterceptor(handler: HandlerInput) {
    console.log('response interceptor');
  }

  @ResponseInterceptor()
  async responseInterceptor2(handler: HandlerInput) {
    console.log('response interceptor 2');
  }

  @RequestInterceptor()
  async requestInterceptor(handler: HandlerInput) {
    console.log('request interceptor');
  }

  @RequestInterceptor()
  async requestInterceptor2(handler: HandlerInput) {
    console.log('request interceptor 2');
  }
}

exports.handler = AskDecorator.handler;
```
