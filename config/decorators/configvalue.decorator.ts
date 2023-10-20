import { configs } from '../configs';
import * as config from 'config';
import { get } from 'lodash';

export function ConfigValue(key: string) {
  return (target: any, propertyName?: any) => {
    Object.defineProperty(target, propertyName, {
      get: () => {
        return get(configs, key) ? get(configs, key) : config.get(key);
      },
    });
  };
}
