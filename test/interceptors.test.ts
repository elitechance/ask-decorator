import { HandlerInput } from 'ask-sdk-core';
import { beforeEach, describe, expect, it } from 'vitest';
import { AskDecorator, ErrorHandler, Intent, RequestInterceptor, ResponseInterceptor } from '../src';
import { intentRequest, speech } from './envelope';

const tick = () => new Promise((resolve) => setTimeout(resolve, 5));
const calls: string[] = [];

class Skill {
  @RequestInterceptor()
  async loadAttributes(handler: HandlerInput) {
    await tick();
    calls.push('request1');
    handler.attributesManager.setRequestAttributes({ loaded: true });
  }

  @RequestInterceptor()
  async second(handler: HandlerInput) {
    await tick();
    calls.push('request2');
    if ((handler.requestEnvelope.request as any).intent.name === 'RejectIntent') {
      throw new Error('interceptor failed');
    }
  }

  @Intent(['ReadIntent', 'RejectIntent'])
  read(handler: HandlerInput) {
    calls.push('handler');
    const { loaded } = handler.attributesManager.getRequestAttributes();
    return handler.responseBuilder.speak(`loaded ${loaded === true}`).getResponse();
  }

  @ResponseInterceptor()
  async save() {
    await tick();
    calls.push('response');
  }

  @ErrorHandler()
  error(handler: HandlerInput, error: Error) {
    return handler.responseBuilder.speak(`error ${error.message}`).getResponse();
  }
}

const invoke = (event: any) => AskDecorator.handler(event, {}, () => {});

describe('async interceptors', () => {
  beforeEach(() => {
    calls.length = 0;
  });

  it('waits for request interceptors before running the handler', async () => {
    expect(speech(await invoke(intentRequest('ReadIntent')))).toBe('<speak>loaded true</speak>');
  });

  it('runs async interceptors sequentially and waits for response interceptors', async () => {
    await invoke(intentRequest('ReadIntent'));
    expect(calls).toEqual(['request1', 'request2', 'handler', 'response']);
  });

  it('routes a rejected request interceptor to the error handler', async () => {
    expect(speech(await invoke(intentRequest('RejectIntent')))).toBe('<speak>error interceptor failed</speak>');
    expect(calls).not.toContain('handler');
  });
});
