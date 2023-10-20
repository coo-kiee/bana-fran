import { PropsWithChildren } from 'react';

// Hook
import useDatePicker from 'hooks/datePicker/useDatePicker';

// Component
import Calander from 'pages/common/calander';

interface IRenderProps extends PropsWithChildren {
  calanderSearchDate: { fromDate: string; toDate: string };
}
interface ICalculateDetailCalander<T> extends PropsWithChildren {
  searchDate: T;
  render: (props: IRenderProps) => JSX.Element;
}
const CalculateDetailCalander = <T extends { fromDate: string; toDate: string }>({
  searchDate,
  children,
  render,
}: ICalculateDetailCalander<T>) => {
  const { date: fromDate, handleDate: handleFromDate } = useDatePicker({ initial: searchDate.fromDate });
  const { date: toDate, handleDate: handleToDate } = useDatePicker({ initial: searchDate.toDate });

  return (
    <>
      <Calander>
        <Calander.DatePicker selected={new Date(fromDate)} onChange={handleFromDate} />
        <i>~</i>
        <Calander.DatePicker selected={new Date(toDate)} onChange={handleToDate} />
      </Calander>
      {render({ calanderSearchDate: { fromDate, toDate }, children })}
    </>
  );
};

export default CalculateDetailCalander;
