import { AskDecorator } from '../lib/ask-decorator';

export function ErrorHandler() {
  return function(target: any, methodName: string) {
    const ask = AskDecorator.Instance;
    ask.target = target;
    ask.errorHandlerMethod = methodName;
  };
}
