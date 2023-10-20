import { FC, PropsWithChildren } from 'react';
import DefaultDatePicker from '../date-picker';

interface ICalander extends PropsWithChildren {}

interface ICalanderComposition {
  DatePicker: typeof DefaultDatePicker;
}

const Calander: FC<ICalander> & ICalanderComposition = ({ children }) => {
  return <div className="input-wrap">{children}</div>;
};

export default Calander;

Calander.DatePicker = DefaultDatePicker;
