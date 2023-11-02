// Hook
import useDatePicker from 'hooks/datePicker/useDatePicker';

// Type
import { SearchDate } from 'constants/calculate/common';

// Component
import Calander from 'pages/common/calander';

interface ICalculateDetailSearch extends Partial<SearchDate> {
  dateFormat?: string;
  showMonthYearPicker?: boolean;
  render: (params: SearchDate) => JSX.Element;
}
const CalculateDetailSearch = ({
  fromDate,
  toDate,
  dateFormat = 'yyyy-MM-dd',
  showMonthYearPicker,
  render,
}: ICalculateDetailSearch) => {
  const { date: calanderFromDate, handleDate: handleCalanderFromDate } = useDatePicker({
    initial: fromDate,
    dateFormat,
  });
  const {
    date: calanderToDate,
    handleDate: handleCalanderToDate,
    validateSearchDate,
  } = useDatePicker({ initial: toDate, dateFormat });

  return (
    <>
      <Calander>
        <Calander.DatePicker
          selected={new Date(calanderFromDate)}
          showMonthYearPicker={showMonthYearPicker}
          dateFormat={dateFormat}
          onChange={(date) => validateSearchDate(date, calanderToDate) && handleCalanderFromDate(date)}
        />
        {toDate && (
          <>
            <i>~</i>
            <Calander.DatePicker
              selected={new Date(calanderToDate)}
              showMonthYearPicker={showMonthYearPicker}
              dateFormat={dateFormat}
              onChange={(date) => validateSearchDate(calanderFromDate, date) && handleCalanderToDate(date)}
            />
          </>
        )}
      </Calander>
      {render({ fromDate: calanderFromDate, toDate: calanderToDate })}
    </>
  );
};

export default CalculateDetailSearch;
