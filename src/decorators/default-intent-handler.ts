import { AskDecorator } from '../lib/ask-decorator';

export function DefaultIntentHandler() {
  return function(target: any, methodName: string) {
    const ask = AskDecorator.Instance;
    ask.target = target;
    ask.defaultIntentHandler = methodName;
  };
}
