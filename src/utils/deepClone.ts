export const deepClone = <T>(object: T): T => {
  if (!(object instanceof Array) && !(object instanceof Object)) return object;

  if (object instanceof Array) {
    //   const newArr: unknown[] | T = [];
    //   object.forEach((value) => newArr.push(deepClone(value)));
    const newArr = object.map(deepClone);

    return newArr as unknown as T;
  }

  const newObj: Record<string, unknown> = {};
  Object.entries(object).forEach(([key, value]) => {
    newObj[key] = deepClone(value);
  });

  return newObj as T;
};
