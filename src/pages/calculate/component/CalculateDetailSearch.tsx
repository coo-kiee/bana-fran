import { PropsWithChildren } from 'react';

// Hook
import useDatePicker from 'hooks/datePicker/useDatePicker';

// Type
import { SearchDate } from 'constants/calculate/common';

// Component
import Calander from 'pages/common/calander';
import CalculateDetailSearchButton from './CalculateDetailSearchButton';

interface ICalculateDetailSearch extends PropsWithChildren {
  searchDate: SearchDate;
  handleSearchDate: (searchDate: SearchDate) => void;
}
const CalculateDetailSearch = ({ searchDate, children, handleSearchDate }: ICalculateDetailSearch) => {
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
      <CalculateDetailSearchButton handleSearch={() => handleSearchDate({ fromDate, toDate })} />
    </>
  );
};

export default CalculateDetailSearch;
