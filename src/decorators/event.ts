import { AskDecorator } from '../lib/ask-decorator';

export function Event() {
  return function(target: Object, propertyKey: string) {
    const ask = AskDecorator.Instance;
    ask.target = target;
    ask.eventProperty = propertyKey;
  };
}
