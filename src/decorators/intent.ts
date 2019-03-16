import { AskDecorator } from '../lib/ask-decorator';

export function Intent(intentName: string | string[]) {
  return function(target: any, methodName: string) {
    const ask = AskDecorator.Instance;
    ask.addIntent(intentName, target, methodName);
  };
}
