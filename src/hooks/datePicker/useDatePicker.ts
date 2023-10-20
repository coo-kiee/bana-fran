import { format } from 'date-fns';
import { useLayoutEffect, useState } from 'react';

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

  useLayoutEffect(() => {
    setDate(format(new Date(initial), dateFormat));
  }, [dateFormat, initial]);

  return { date, handleDate };
};

export default useDatePicker;
