# ASK-DECORATOR

Typescript decorators for ASK SDK v2 for Node.js

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
  Context
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

  @ResponseInterceptor()
  responseInterceptor(handler: HandlerInput) {
    return new Promise((resolve, reject) => {
      console.log('response interceptor');
    });
  }

  @ResponseInterceptor()
  responseInterceptor2(handler: HandlerInput) {
    return new Promise((resolve, reject) => {
      console.log('response interceptor 2');
    });
  }

  @RequestInterceptor()
  requestInterceptor(handler: HandlerInput) {
    return new Promise((resolve, reject) => {
      console.log('request interceptor');
    });
  }

  @RequestInterceptor()
  requestInterceptor2(handler: HandlerInput) {
    return new Promise((resolve, reject) => {
      console.log('request interceptor 2');
    });
  }
}

exports.handler = AskDecorator.handler;
```
