import { FC } from 'react';
import { useIsFetching } from 'react-query';

// Hook
import usePageInfo from 'hooks/pagination/usePageInfo';
import usePages from 'hooks/pagination/usePages';

// Component
import SelectListRow from './SelectListRow';

const Pages: FC = () => {
  const { pageInfo, handleCurrentPage } = usePageInfo();
  const { pages, showPageCnt, maxPage, showPage } = usePages(pageInfo);
  const fetchingCnt = useIsFetching();

  if (!pageInfo.dataCnt || fetchingCnt > 0) return null;

  const handlePrev = () => {
    const updatePage = Math.max(pageInfo.currentPage - showPageCnt, 1);
    handleCurrentPage(updatePage);
  };

  const handleNext = () => {
    const updatePage = Math.min(pageInfo.currentPage + showPageCnt, maxPage);
    handleCurrentPage(updatePage);
  };

  return (
    <>
      <div className="paging-wrap">
        <button
          className="btn-prev"
          aria-label="이전 페이지로 이동"
          onClick={handlePrev}
          disabled={pageInfo.currentPage === 1}
        ></button>
        <ul className="paging">
          {pages.map(
            (page, index) =>
              showPage(index) && (
                <li
                  key={page}
                  onClick={() => handleCurrentPage(page)}
                  className={pageInfo.currentPage === page ? 'active' : ''}
                >
                  {page}
                </li>
              ),
          )}
        </ul>
        <button
          className="btn-next"
          aria-label="다음 페이지로 이동"
          onClick={handleNext}
          disabled={pageInfo.currentPage === maxPage}
        ></button>
      </div>
      <SelectListRow />
    </>
  );
};

export default Pages;
