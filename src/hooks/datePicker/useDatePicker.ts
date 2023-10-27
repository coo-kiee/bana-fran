import { useState } from 'react';
import { format } from 'date-fns';

interface IUseDatePicker {
  initial?: Date | string;
  dateFormat?: string;
}
const useDatePicker = (props: IUseDatePicker = {}) => {
  const { initial = new Date(), dateFormat = 'yyyy-MM-dd' } = props;

  const [date, setDate] = useState(format(new Date(initial), dateFormat));

  const handleDate = (date: Date | string | null) => {
    if (!date) return;

    setDate(format(new Date(date), dateFormat));
  };

  const validateSearchDate = (fromDate: Date | string | null, toDate: Date | string | null) => {
    const res = fromDate && toDate && new Date(fromDate) <= new Date(toDate);

    if (!res) alert('날짜를 확인해 주세요');

    return res;
  };

  return { date, handleDate, validateSearchDate };
};

export default useDatePicker;
