import { AskDecorator } from '../lib/ask-decorator';

export function Callback() {
  return function(target: Object, propertyKey: string) {
    const ask = AskDecorator.Instance;
    ask.target = target;
    ask.callbackProperty = propertyKey;
  };
}
