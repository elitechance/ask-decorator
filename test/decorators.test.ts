import { describe, expect, it } from 'vitest';
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
  SessionEndedRequest,
} from '../src';

class First {
  @Event() e: any;
  @Context() c: any;
  @Callback() cb: any;
  @PostConstructor() post() {}
  @Intent('A') a() {}
  @Intent(['B', 'C']) bc() {}
  @LaunchRequest() launch() {}
  @SessionEndedRequest() ended() {}
  @DefaultIntentHandler() fallback() {}
  @ErrorHandler() error() {}
}

class Second {
  @Intent('D') d() {}
}

describe('decorators', () => {
  const ask: any = AskDecorator.Instance;

  it('shares a singleton instance', () => {
    expect(AskDecorator.Instance).toBe(ask);
  });

  it('keeps the first decorated class as the target', () => {
    expect(ask.target).toBe(First.prototype);
  });

  it('registers property and method names', () => {
    expect(ask.eventProperty).toBe('e');
    expect(ask.contextProperty).toBe('c');
    expect(ask.callbackProperty).toBe('cb');
    expect(ask.postConstructorMethod).toBe('post');
    expect(ask.launchRequestMethod).toBe('launch');
    expect(ask.sessionEndedRequestMethod).toBe('ended');
    expect(ask.defaultIntentHandler).toBe('fallback');
    expect(ask.errorHandlerMethod).toBe('error');
  });

  it('registers intents in declaration order', () => {
    expect(ask.intents).toEqual([
      { intent: 'A', methodName: 'a' },
      { intent: ['B', 'C'], methodName: 'bc' },
      { intent: 'D', methodName: 'd' },
    ]);
  });
});
