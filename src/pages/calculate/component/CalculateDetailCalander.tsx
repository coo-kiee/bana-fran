import { PropsWithChildren } from 'react';

// Hook
import useDatePicker from 'hooks/datePicker/useDatePicker';

// Component
import Calander from 'pages/common/calander';
interface ICalculateDetailCalander<T> extends PropsWithChildren {
  searchDate: T;
  render: (calanderSearchDate: { fromDate: string; toDate: string }) => JSX.Element;
}
const CalculateDetailCalander = <T extends { fromDate: string; toDate: string }>({
  searchDate,
  children,
  render,
}: ICalculateDetailCalander<T>) => {
  const { date: fromDate, handleDate: handleFromDate } = useDatePicker({ initial: searchDate.fromDate });
  const { date: toDate, handleDate: handleToDate, validateSearchDate } = useDatePicker({ initial: searchDate.toDate });

  return (
    <>
      <Calander>
        <Calander.DatePicker
          selected={new Date(fromDate)}
          onChange={(date) => validateSearchDate(date, toDate) && handleFromDate(date)}
        />
        <i>~</i>
        <Calander.DatePicker
          selected={new Date(toDate)}
          onChange={(date) => validateSearchDate(fromDate, date) && handleToDate(date)}
        />
      </Calander>
      {children}
      {render({ fromDate, toDate })}
    </>
  );
};

export default CalculateDetailCalander;
