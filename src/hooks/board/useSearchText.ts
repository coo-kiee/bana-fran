import { useState } from 'react';

interface IUseSearchTextParams<T> {
  tabTypeObj: T;
  tabType: T[keyof T];
}
const useSearchText = <T extends Record<string | number, string | number>>({
  tabTypeObj,
  tabType,
}: IUseSearchTextParams<T>) => {
  const tabSearchText = Object.values(tabTypeObj).reduce(
    (arr, cur) => ({ ...arr, [cur]: '' }),
    {} as Record<T[keyof T], string>,
  );

  const [searchTextInfo, setSearchTextInfo] = useState(tabSearchText);
  const handleSearchText = (value: string) => {
    setSearchTextInfo((prev) => ({ ...prev, [tabType]: value }));
  };

  return { searchText: searchTextInfo[tabType], handleSearchText };
};

export default useSearchText;
