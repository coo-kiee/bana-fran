// Hook
import useDatePicker from 'hooks/datePicker/useDatePicker';

// Type
import { SearchDate } from 'constants/calculate/common';

// Component
import DefaultDatePicker from '../date-picker';
interface ICalander extends Partial<SearchDate> {
  dateFormat?: string;
  showMonthYearPicker?: boolean;
  render: (params: SearchDate) => JSX.Element;
}

const Calander = ({ fromDate, toDate, dateFormat = 'yyyy-MM-dd', showMonthYearPicker, render }: ICalander) => {
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
      <div className="input-wrap">
        <DefaultDatePicker
          selected={new Date(calanderFromDate)}
          showMonthYearPicker={showMonthYearPicker}
          dateFormat={dateFormat}
          onChange={(date) => validateSearchDate(date, calanderToDate) && handleCalanderFromDate(date)}
        />
        {toDate && (
          <>
            <i>~</i>
            <DefaultDatePicker
              selected={new Date(calanderToDate)}
              showMonthYearPicker={showMonthYearPicker}
              dateFormat={dateFormat}
              onChange={(date) => validateSearchDate(calanderFromDate, date) && handleCalanderToDate(date)}
            />
          </>
        )}
      </div>
      {render({ fromDate: calanderFromDate, toDate: calanderToDate })}
    </>
  );
};

export default Calander;
