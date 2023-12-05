import { FC, InputHTMLAttributes } from 'react';

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: FC<IInput> = ({ label, type = 'text', ...attr }) => {
  return (
    <>
      <input type={type} {...attr} />
      {type !== 'text' && label && <label htmlFor={attr.id || ''}>{label}</label>}
    </>
  );
};

export default Input;
