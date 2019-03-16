import { AskDecorator } from '../lib/ask-decorator';

export function PostConstructor() {
  return function(target: any, methodName: string) {
    const ask = AskDecorator.Instance;
    ask.target = target;
    ask.postConstructorMethod = methodName;
  };
}
