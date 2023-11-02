import { ChangeEventHandler } from 'react';

interface ISelect {
  name: string;
  value: string | number;
  options: readonly {
    label: string;
    value: string | number;
  }[];
  handleOnChange: ChangeEventHandler;
}
const Select = ({ name, value, options, handleOnChange }: ISelect) => {
  return (
    <select onChange={handleOnChange} name={name} value={value}>
      {Object.values(options).map((item) => (
        <option key={item.label} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
