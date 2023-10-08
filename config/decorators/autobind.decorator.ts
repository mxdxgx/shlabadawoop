/**
 * Return a descriptor removing the value and returning a getter
 * The getter will return a .bind version of the function
 * and memoize the result against a symbol on the instance
 */
export function boundMethod<T>(
  target: any,
  key: string,
  descriptor: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> {
  let fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new TypeError(
      `@boundMethod decorator can only be applied to methods not: ${typeof fn}`,
    );
  }

  // In IE11 calling Object.defineProperty has a side-effect of evaluating the
  // getter for the property which is being replaced. This causes infinite
  // recursion and an "Out of stack space" error.
  let definingProperty = false;

  return {
    configurable: true,
    get(this: T) {
      // eslint-disable-next-line no-prototype-builtins
      if (
        definingProperty ||
        this === target.prototype ||
        Object.prototype.hasOwnProperty.call(this, key) ||
        typeof fn !== 'function'
      ) {
        return fn;
      }

      const boundFn = fn.bind(this);
      definingProperty = true;
      Object.defineProperty(this, key, {
        configurable: true,
        get() {
          return boundFn;
        },
        set(value) {
          fn = value;
          delete this[key];
        },
      });
      definingProperty = false;
      return boundFn;
    },
    set(value: T) {
      fn = value;
    },
  };
}

/**
 * Use boundMethod to bind all methods on the target.prototype
 */
export function boundClass<T>(target: new () => T): new () => T {
  // (Using reflect to get all keys including symbols)
  let keys: (string | symbol)[];
  // Use Reflect if exists
  if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
    keys = Reflect.ownKeys(target.prototype);
  } else {
    keys = Object.getOwnPropertyNames(target.prototype);
    // Use symbols if support is provided
    if (typeof Object.getOwnPropertySymbols === 'function') {
      keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
    }
  }

  keys.forEach((key) => {
    // Ignore special case target method
    if (key === 'constructor') {
      return;
    }

    const descriptor = Object.getOwnPropertyDescriptor(
      target.prototype,
      key.toString(),
    );

    // Only methods need binding
    if (descriptor && typeof descriptor.value === 'function') {
      Object.defineProperty(
        target.prototype,
        key,
        boundMethod(target.prototype, key.toString(), descriptor),
      );
    }
  });
  return target;
}

export default function autobind<T>(
  ...args: [new () => T] | [any, string, TypedPropertyDescriptor<T>]
): new () => T {
  if (args.length === 1) {
    return boundClass(args[0]);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return boundMethod(args[0], args[1], args[2]);
}
