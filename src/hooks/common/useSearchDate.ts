import { useState } from 'react';
import { setMonth, format, setDate, lastDayOfMonth } from 'date-fns';

// Type
import { SearchDate } from 'constants/calculate/common';
interface IUseSearchDate<T> {
  fromDate?: Date;
  toDate?: Date;
  dateFormat?: string;
  tabTypeObj?: T;
  tabType?: T[keyof T];
}

const useSearchDate = <T extends Record<string | number, string | number>>(params: IUseSearchDate<T> = {}) => {
  const { tabTypeObj, tabType, dateFormat = 'yyyy-MM-dd' } = params;

  const lastMonthDate = setMonth(new Date(), new Date().getMonth() - 1);

  const initialSearchDate: SearchDate = {
    fromDate: format(params.fromDate || setDate(lastMonthDate, 1), dateFormat),
    toDate: format(params.toDate || lastDayOfMonth(lastMonthDate), dateFormat),
  };

  const [searchDate, setSearchDate] = useState(() => {
    if (!tabTypeObj || !tabType) return initialSearchDate;

    return Object.values(tabTypeObj).reduce(
      (arr, cur) => ({ ...arr, [cur]: { ...initialSearchDate } }),
      {} as Record<T[keyof T], SearchDate>,
    );
  });

  const handleSearchDate = !tabType
    ? setSearchDate
    : (searchDate: SearchDate) => {
        setSearchDate((prev) => ({ ...prev, [tabType]: searchDate }));
      };

  return {
    searchDate: !tabType ? searchDate : (searchDate as Record<T[keyof T], SearchDate>)[tabType],
    handleSearchDate,
  } as { searchDate: SearchDate; handleSearchDate: typeof handleSearchDate };
};

export default useSearchDate;
