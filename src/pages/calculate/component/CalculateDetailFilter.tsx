import { ChangeEventHandler, FC } from 'react';

interface ICalculateDetailFilter {
  name: string;
  value: string | number;
  options: readonly {
    label: string;
    value: string | number;
  }[];
  handleOnChange: ChangeEventHandler;
}
const CalculateDetailFilter: FC<ICalculateDetailFilter> = ({
  name,
  value,
  options,
  handleOnChange,
}: ICalculateDetailFilter) => {
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

export default CalculateDetailFilter;
