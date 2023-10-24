// Type
import { IPageInfo } from 'pages/common/pagination/PageInfoProvider';

const usePages = (pageInfo: IPageInfo) => {
  const showPageCnt = 10;

  const maxPage = Math.ceil(pageInfo.dataCnt / pageInfo.row);
  const pages = Array.from({ length: maxPage }, (value, index: number) => index + 1);

  const lastPageIdx = Math.min(Math.ceil(pageInfo.currentPage / showPageCnt) * showPageCnt - 1, maxPage);
  const startPageIdx = Math.max(lastPageIdx - (showPageCnt - 1), 0);

  const showPage = (index: number) => {
    return index >= startPageIdx && index <= lastPageIdx;
  };

  return { pages, startPageIdx, lastPageIdx, showPageCnt, maxPage, showPage };
};

export default usePages;
