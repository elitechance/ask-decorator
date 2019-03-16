import { AskDecorator } from '../lib/ask-decorator';

export function RequestInterceptor() {
  return function(target: any, methodName: string) {
    const ask = AskDecorator.Instance;
    ask.target = target;
    ask.requestInterceptor = methodName;
  };
}
