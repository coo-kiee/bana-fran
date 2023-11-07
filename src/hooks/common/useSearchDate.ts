import { useState } from 'react';
import { setMonth, format, setDate, lastDayOfMonth } from 'date-fns';

// Type
import { SearchDate } from 'constants/calculate/common';

// Util
import { deepClone } from 'utils/deepClone';
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

  const tabSearchDate = Object.values(tabTypeObj || {}).reduce(
    (arr, cur) => ({ ...arr, [cur]: { ...initialSearchDate } }),
    {} as Record<T[keyof T], SearchDate>,
  );

  const [searchDate, setSearchDate] = useState({ ...initialSearchDate, ...deepClone(tabSearchDate) });

  const handleSearchDate = (searchDate: Partial<SearchDate>) => {
    setSearchDate((prev) => {
      return tabType ? { ...prev, [tabType]: { ...prev[tabType], ...searchDate } } : { ...prev, ...searchDate };
    });
  };

  return {
    searchDate: !tabType ? searchDate : searchDate[tabType],
    handleSearchDate,
  };
};

export default useSearchDate;
