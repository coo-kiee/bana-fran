// Hook
import useUserInfo from 'hooks/user/useUser';

// API
import { useBoardCategoryList } from 'service/boardService';

interface IUseCategoryFilters<T> {
  tabType: number;
  initial: T;
}
const useCategoryFilters = <T>({ tabType, initial }: IUseCategoryFilters<T>) => {
  const { user } = useUserInfo();

  // Query
  const boardCategoryList = useBoardCategoryList({
    boardType: tabType,
    nFCode: user.fCode,
  });
  const categoryFilters = boardCategoryList.data?.map((item) => ({ label: item.code_name, value: item.code })) || [];

  return { categoryFilters: [...(initial as unknown as []), ...categoryFilters] };
};

export default useCategoryFilters;
