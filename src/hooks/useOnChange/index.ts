import { ChangeEventHandler } from 'react';

const useOnChange = <T>(setState: React.Dispatch<React.SetStateAction<T>>) => {
  const handleOnChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (e) => {
    const { target } = e;
    const { name, value, type } = target;

    const isCheckBox = target instanceof HTMLInputElement && /checkbox/.test(type);
    const targetValue = isCheckBox ? target.checked : value;

    setState((prev) => {
      const isNumber = typeof prev[name as keyof typeof prev] === 'number' || typeof prev === 'number';
      const updateValue = isNumber ? Number(String(targetValue).replaceAll(/\D/g, '')) : targetValue;

      if (typeof prev === 'object') return { ...prev, [name]: updateValue };
      return updateValue as unknown as T;
    });
  };

  return handleOnChange;
};

export default useOnChange;
