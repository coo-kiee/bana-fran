// Util
import { downloadExcel, IExcelDownload } from 'utils/excelDownload';

// Hook
import usePageInfo from 'hooks/pagination/usePageInfo';

interface IExcelButton extends IExcelDownload {
  tableRef?: React.MutableRefObject<HTMLTableElement | null>;
}
const ExcelButton = ({ tableRef, ...excelDownloadOption }: IExcelButton) => {
  const { pageInfo } = usePageInfo();

  if (pageInfo?.dataCnt === 0) return null;

  const excelDownload = () => {
    if (!tableRef?.current) return;

    const resMsg = downloadExcel({
      ...excelDownloadOption,
      target: tableRef?.current || excelDownloadOption.target,
    });

    if (resMsg) alert(resMsg);
  };

  return (
    <div className="function">
      <button className="goast-btn" onClick={excelDownload}>
        엑셀다운
      </button>
    </div>
  );
};

export default ExcelButton;
