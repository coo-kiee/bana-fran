import { FC, useContext } from 'react';

// Hook
import useHandlePageInfo from 'hooks/pagination/useHandlePageInfo';
import usePages from 'hooks/pagination/usePages';

// Context
import { PageInfoContext, SetPageInfoContext } from './PageInfoProvider';

// Component
import SelectListRow from './SelectListRow';

const Pages: FC = () => {
  const pageInfo = useContext(PageInfoContext);
  const setPageInfo = useContext(SetPageInfoContext);
  const { handleCurrentPage } = useHandlePageInfo(setPageInfo);

  const { pages, startPageIdx, lastPageIdx, showPageCnt, maxPage } = usePages(pageInfo);

  if (!pageInfo.dataCnt) return null;

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
        <button className="btn-prev" onClick={handlePrev} disabled={pageInfo.currentPage === 1}></button>
        <ul className="paging">
          {pages.map(
            (page, idx) =>
              idx >= startPageIdx &&
              idx <= lastPageIdx && (
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
        <button className="btn-next" onClick={handleNext} disabled={pageInfo.currentPage === maxPage}></button>
      </div>
      <SelectListRow />
    </>
  );
};

export default Pages;
