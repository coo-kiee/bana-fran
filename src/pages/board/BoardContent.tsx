import { useRef } from 'react';
import { useParams } from 'react-router-dom';

// Const
import { PAGE_URL } from 'pages/common/sideMenubar/data/SideMenu';
import { BoardTab, BOARD_FILTER_OPTION, BOARD_FILTER_TYPE, BOARD_TAB } from 'constants/board';

// Hook
import useCategoryFilters from 'hooks/board/useCategoryFilters';
import useSearchText from 'hooks/board/useSearchText';
import useBoardFilterCondition from 'hooks/board/useBoardFilterCondition';

// Component
import Select from 'pages/common/select';
import Form from 'pages/common/form';
import BoardDetail from 'pages/board/BoardDetail';
import BoardTable from './BoardTable';

interface IBoardContent {
  tabType: BoardTab;
}
const BoardContent = ({ tabType }: IBoardContent) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { searchText, handleSearchText } = useSearchText({
    tabType,
    tabTypeObj: BOARD_TAB,
  });

  const handleSearch = () => {
    if (!searchInputRef.current) return;

    handleSearchText(searchInputRef.current.value);
  };

  const { categoryFilters } = useCategoryFilters({
    tabType,
    initial: BOARD_FILTER_OPTION[tabType as keyof typeof BOARD_FILTER_OPTION][BOARD_FILTER_TYPE.CATEGORY],
  });
  const { filterCondition, handleFilterCondition } = useBoardFilterCondition(tabType);

  const { bId = '' } = useParams();
  if (bId) return <BoardDetail baseUrl={`${PAGE_URL.BOARD}`} />;

  return (
    <>
      <div className="sort-wrap">
        <Select
          name={BOARD_FILTER_TYPE.CATEGORY}
          value={filterCondition[BOARD_FILTER_TYPE.CATEGORY]}
          options={categoryFilters}
          handleOnChange={handleFilterCondition}
        />
        <Form onSubmit={handleSearch}>
          <input key={tabType} ref={searchInputRef} type="text" placeholder="제목/내용" defaultValue={searchText} />
          <button className="btn-search">조회</button>
        </Form>
      </div>
      <BoardTable tabType={tabType} category={filterCondition[BOARD_FILTER_TYPE.CATEGORY]} searchText={searchText} />
    </>
  );
};

export default BoardContent;
