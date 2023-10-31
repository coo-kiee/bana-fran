import { useState } from 'react';
import { setMonth, format, setDate, lastDayOfMonth } from 'date-fns';

// Type
import { SearchDate } from 'constants/calculate/common';
interface IUseSearchDate<T> {
  dateFormat?: string;
  tabTypeObj?: T;
  tabType?: T[keyof T];
}

const useSearchDate = <T extends Record<string | number, string | number>>(params: IUseSearchDate<T> = {}) => {
  const { tabTypeObj, tabType, dateFormat = 'yyyy-MM-dd' } = params;

  const lastMonth = setMonth(new Date(), new Date().getMonth() - 1);

  const initial: SearchDate = {
    fromDate: format(setDate(lastMonth, 1), dateFormat),
    toDate: format(lastDayOfMonth(lastMonth), dateFormat),
  };

  const [searchDate, setSearchDate] = useState(() => {
    if (!tabTypeObj || !tabType) return initial;

    return Object.values(tabTypeObj).reduce(
      (arr, cur) => ({ ...arr, [cur]: { ...initial } }),
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
