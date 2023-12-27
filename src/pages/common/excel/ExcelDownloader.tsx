import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsFetching } from 'react-query';

// Util
import { downloadExcel, IExcelDownload } from 'utils/excelDownload';

interface IExcelButton extends Omit<IExcelDownload, 'target'> {
  children?: React.ReactNode;
  dataCnt?: number;
}

const ExcelDownloader = ({ children, dataCnt, ...excelDownloadOption }: IExcelButton) => {
  const [isDownloadExcel, setIsDownloadExcel] = useState(false);
  const excelRef = useRef(null);

  const pageDataCnt = dataCnt;

  const fetchingCnt = useIsFetching();

  const excelDownload = useCallback(() => {
    if (!children) return;

    const resMsg = downloadExcel({
      ...excelDownloadOption,
      target: excelRef?.current,
    });

    if (resMsg) alert(resMsg);
    setIsDownloadExcel(false);
  }, [children, excelDownloadOption]);

  // table 렌더링 후 다운로드 실행
  useEffect(() => {
    if (isDownloadExcel) excelDownload();
  }, [excelDownload, isDownloadExcel]);

  if (pageDataCnt === 0 || fetchingCnt > 0) return null;

  return (
    <>
      <div className="function">
        <button className="goast-btn" onClick={() => setIsDownloadExcel(true)}>
          엑셀다운
        </button>
      </div>
      {/* 다운로드시 table 생성 */}
      {isDownloadExcel && (
        <table className="board-wrap board-top excel-table" cellPadding="0" cellSpacing="0" ref={excelRef}>
          {children}
        </table>
      )}
    </>
  );
};

export default ExcelDownloader;
