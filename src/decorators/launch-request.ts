import { AskDecorator } from '../lib/ask-decorator';

export function LaunchRequest() {
  return function(target: any, methodName: string) {
    const ask = AskDecorator.Instance;
    ask.target = target;
    ask.launchRequestMethod = methodName;
  };
}
