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
  dateFormat?: string;
  showMonthYearPicker?: boolean;
}
const CalculateDetailSearch = ({
  searchDate,
  children,
  handleSearchDate,
  dateFormat = 'yyyy-MM-dd',
  showMonthYearPicker,
}: ICalculateDetailSearch) => {
  const { date: fromDate, handleDate: handleFromDate } = useDatePicker({ initial: searchDate.fromDate, dateFormat });
  const {
    date: toDate,
    handleDate: handleToDate,
    validateSearchDate,
  } = useDatePicker({ initial: searchDate.toDate, dateFormat });

  return (
    <>
      <Calander>
        <Calander.DatePicker
          selected={new Date(fromDate)}
          showMonthYearPicker={showMonthYearPicker}
          dateFormat={dateFormat}
          onChange={(date) => validateSearchDate(date, toDate) && handleFromDate(date)}
        />
        <i>~</i>
        <Calander.DatePicker
          selected={new Date(toDate)}
          showMonthYearPicker={showMonthYearPicker}
          dateFormat={dateFormat}
          onChange={(date) => validateSearchDate(fromDate, date) && handleToDate(date)}
        />
      </Calander>
      {children}
      <CalculateDetailSearchButton handleSearch={() => handleSearchDate({ fromDate, toDate })} />
    </>
  );
};

export default CalculateDetailSearch;
