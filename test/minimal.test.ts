import { HandlerInput } from 'ask-sdk-core';
import { describe, expect, it } from 'vitest';
import { AskDecorator, Intent } from '../src';
import { intentRequest, launchRequest, sessionEndedRequest, speech } from './envelope';

class Skill {
  @Intent('OnlyIntent')
  only(handler: HandlerInput) {
    return handler.responseBuilder.speak('only').getResponse();
  }
}

const invoke = (event: any) => AskDecorator.handler(event, {}, () => {});

describe('AskDecorator.handler without optional handlers', () => {
  it('routes the registered intent', async () => {
    expect(speech(await invoke(intentRequest('OnlyIntent')))).toBe('<speak>only</speak>');
  });

  it('rejects unknown intents when there is no default or error handler', async () => {
    await expect(invoke(intentRequest('UnknownIntent'))).rejects.toThrow(/Unable to find a suitable request handler/);
  });

  it('rejects launch requests when there is no launch handler', async () => {
    await expect(invoke(launchRequest())).rejects.toThrow(/Unable to find a suitable request handler/);
  });

  it('rejects session ended requests when there is no session ended handler', async () => {
    await expect(invoke(sessionEndedRequest())).rejects.toThrow(/Unable to find a suitable request handler/);
  });
});
