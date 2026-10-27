import { HandlerInput } from 'ask-sdk-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AskDecorator,
  Callback,
  Context,
  DefaultIntentHandler,
  ErrorHandler,
  Event,
  Intent,
  LaunchRequest,
  PostConstructor,
  RequestInterceptor,
  ResponseInterceptor,
  SessionEndedRequest,
} from '../src';
import { envelope, intentRequest, launchRequest, sessionEndedRequest, speech } from './envelope';

const calls: string[] = [];
const seen: any = {};
let constructed = 0;

class Skill {
  @Event() event: any;
  @Callback() callback: any;
  @Context() context: any;

  constructor() {
    constructed++;
  }

  @PostConstructor()
  init() {
    calls.push('post');
    seen.event = this.event;
    seen.context = this.context;
    seen.callback = this.callback;
  }

  @Intent('CustomIntent')
  custom(handler: HandlerInput) {
    calls.push('custom');
    return handler.responseBuilder.speak('custom').getResponse();
  }

  @Intent(['Custom1Intent', 'Custom2Intent'])
  multi(handler: HandlerInput) {
    const name = (handler.requestEnvelope.request as any).intent.name;
    return handler.responseBuilder.speak(`multi ${name}`).getResponse();
  }

  @Intent('ThrowIntent')
  throws() {
    throw new Error('boom');
  }

  @LaunchRequest()
  launch(handler: HandlerInput) {
    return handler.responseBuilder.speak('launch').getResponse();
  }

  @SessionEndedRequest()
  ended(handler: HandlerInput) {
    return handler.responseBuilder.speak('ended').getResponse();
  }

  @DefaultIntentHandler()
  fallback(handler: HandlerInput) {
    return handler.responseBuilder.speak('default').getResponse();
  }

  @ErrorHandler()
  error(handler: HandlerInput, error: Error) {
    return handler.responseBuilder.speak(`error ${error.message}`).getResponse();
  }

  @RequestInterceptor()
  request1(handler: HandlerInput) {
    calls.push(`request1:${handler.requestEnvelope.request.type}`);
  }

  @RequestInterceptor()
  request2() {
    calls.push('request2');
  }

  @ResponseInterceptor()
  response1() {
    calls.push('response1');
  }

  @ResponseInterceptor()
  response2() {
    calls.push('response2');
  }
}

const context = { awsRequestId: 'ctx' };
const callback = () => {};

const invoke = (event: any) => AskDecorator.handler(event, context, callback);

describe('AskDecorator.handler', () => {
  beforeEach(() => {
    calls.length = 0;
  });

  it('routes a single intent', async () => {
    expect(speech(await invoke(intentRequest('CustomIntent')))).toBe('<speak>custom</speak>');
  });

  it('routes each intent of a multi-intent handler', async () => {
    expect(speech(await invoke(intentRequest('Custom1Intent')))).toBe('<speak>multi Custom1Intent</speak>');
    expect(speech(await invoke(intentRequest('Custom2Intent')))).toBe('<speak>multi Custom2Intent</speak>');
  });

  it('falls back to the default intent handler', async () => {
    expect(speech(await invoke(intentRequest('UnknownIntent')))).toBe('<speak>default</speak>');
  });

  it('routes launch requests', async () => {
    expect(speech(await invoke(launchRequest()))).toBe('<speak>launch</speak>');
  });

  it('routes session ended requests', async () => {
    expect(speech(await invoke(sessionEndedRequest()))).toBe('<speak>ended</speak>');
  });

  it('routes handler errors to the error handler', async () => {
    expect(speech(await invoke(intentRequest('ThrowIntent')))).toBe('<speak>error boom</speak>');
  });

  it('routes unsupported request types to the error handler', async () => {
    const response = await invoke(envelope({ type: 'Display.ElementSelected', token: 't' }));
    expect(speech(response)).toMatch(/^<speak>error /);
  });

  it('runs interceptors in order around the handler', async () => {
    await invoke(intentRequest('CustomIntent'));
    expect(calls).toEqual(['post', 'request1:IntentRequest', 'request2', 'custom', 'response1', 'response2']);
  });

  it('injects event, context and callback before the post constructor', async () => {
    const event = intentRequest('CustomIntent');
    await invoke(event);
    expect(seen.event).toBe(event);
    expect(seen.context).toBe(context);
    expect(seen.callback).toBe(callback);
  });

  it('runs the post constructor on every request', async () => {
    await invoke(launchRequest());
    await invoke(launchRequest());
    expect(calls.filter((c) => c === 'post')).toHaveLength(2);
  });

  it('reuses a single instance of the decorated class', async () => {
    await invoke(launchRequest());
    expect(constructed).toBe(1);
  });

  it('returns a response envelope', async () => {
    const response: any = await invoke(launchRequest());
    expect(response.version).toBe('1.0');
    expect(response.userAgent).toMatch(/ask-node/);
  });
});
