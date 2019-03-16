import { AskDecorator } from '../lib/ask-decorator';

export function SessionEndedRequest() {
  return function(target: any, methodName: string) {
    const ask = AskDecorator.Instance;
    ask.target = target;
    ask.sessionEndedRequestMethod = methodName;
  };
}
