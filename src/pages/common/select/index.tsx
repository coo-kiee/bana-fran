import { ChangeEventHandler } from 'react';

interface ISelect {
  className?: string;
  name: string;
  value: string | number;
  options: readonly {
    label: string;
    value: string | number;
  }[];
  handleOnChange: ChangeEventHandler;
}
const Select = ({ className, name, value, options, handleOnChange }: ISelect) => {
  return (
    <select className={className} name={name} value={value} onChange={handleOnChange}>
      {Object.values(options).map((item) => (
        <option key={item.label} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
