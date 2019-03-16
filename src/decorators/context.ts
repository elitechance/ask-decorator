import { AskDecorator } from '../lib/ask-decorator';

export function Context() {
  return function(target: Object, propertyKey: string) {
    const ask = AskDecorator.Instance;
    ask.target = target;
    ask.contextProperty = propertyKey;
  };
}
