import { AskDecorator } from '../lib/ask-decorator';

export function ResponseInterceptor() {
  return function(target: any, methodName: string) {
    const ask = AskDecorator.Instance;
    ask.target = target;
    ask.responseInterceptor = methodName;
  };
}
