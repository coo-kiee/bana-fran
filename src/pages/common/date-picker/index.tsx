import { FC } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { ko } from 'date-fns/locale';

interface IDefaultDatePicker extends ReactDatePickerProps {}

const DefaultDatePicker: FC<IDefaultDatePicker> = ({ ...reactDatePickerProps }) => {
  return <DatePicker locale={ko} maxDate={new Date()} dateFormat={'yyyy-MM-dd'} {...reactDatePickerProps} />;
};

export default DefaultDatePicker;
