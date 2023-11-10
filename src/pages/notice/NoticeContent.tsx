import { useRef } from 'react';
import { useParams } from 'react-router-dom';

// Const
import { PAGE_URL } from 'pages/common/sideMenubar/data/SideMenu';
import { NoticeTab, NOTICE_FILTER_OPTION, NOTICE_FILTER_TYPE, NOTICE_TAB } from 'constants/notice';

// Hook
import useCategoryFilters from 'hooks/board/useCategoryFilters';
import useNoticeFilterCondition from 'hooks/notice/useNoticeFilterCondition';
import useSearchText from 'hooks/board/useSearchText';

// Component
import Select from 'pages/common/select';
import NoticeTable from './NoticeTable';
import Form from 'pages/common/form';
import BoardDetail from 'pages/board/BoardDetail';

interface INoticeContent {
  tabType: NoticeTab;
}
const NoticeContent = ({ tabType }: INoticeContent) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { searchText, handleSearchText } = useSearchText({
    tabType,
    tabTypeObj: NOTICE_TAB,
  });

  const handleSearch = () => {
    if (!searchInputRef.current) return;

    handleSearchText(searchInputRef.current.value);
  };

  const { categoryFilters } = useCategoryFilters({
    tabType,
    initial: NOTICE_FILTER_OPTION[tabType as keyof typeof NOTICE_FILTER_OPTION][NOTICE_FILTER_TYPE.CATEGORY],
  });
  const { filterCondition, handleFilterCondition } = useNoticeFilterCondition(tabType);

  const { bId = '' } = useParams();
  if (bId) return <BoardDetail baseUrl={`${PAGE_URL.NOTICE}`} />;

  return (
    <>
      <div className="sort-wrap">
        <Select
          name={NOTICE_FILTER_TYPE.CATEGORY}
          value={filterCondition[NOTICE_FILTER_TYPE.CATEGORY]}
          options={categoryFilters}
          handleOnChange={handleFilterCondition}
        />
        <Form onSubmit={handleSearch}>
          <input key={tabType} ref={searchInputRef} type="text" placeholder="제목/내용" defaultValue={searchText} />
          <button className="btn-search">조회</button>
        </Form>
      </div>
      <NoticeTable tabType={tabType} category={filterCondition[NOTICE_FILTER_TYPE.CATEGORY]} searchText={searchText} />
    </>
  );
};

export default NoticeContent;
