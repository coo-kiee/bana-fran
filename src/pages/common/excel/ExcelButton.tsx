// Util
import { downloadExcel, IExcelDownload } from 'utils/excelDownload';

// Hook
import useUserInfo from 'hooks/user/useUser';
import usePageInfo from 'hooks/pagination/usePageInfo';

interface IExcelButton<T> {
  titleFrom: string;
  titleTo: string;
  colspan: T;
  tableRef?: React.MutableRefObject<HTMLTableElement | null>;
  excelFileName: string;
  excelOption?: IExcelDownload;
}
const ExcelButton = <T,>({ titleFrom, titleTo, colspan, tableRef, excelFileName, excelOption }: IExcelButton<T>) => {
  const { user } = useUserInfo();
  const { pageInfo } = usePageInfo();

  if (!pageInfo.dataCnt) return null;

  const excelDownload = () => {
    if (!tableRef?.current) return;

    downloadExcel({
      fileName: `${user.fCodeName}_${excelFileName}(${titleFrom}~${titleTo})`,
      type: 'table',
      sheetOption: { origin: 'B3' }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
      colWidths: (colspan as unknown as []).map((wpx) => (wpx !== '*' ? { wpx: Number(wpx) * 1.2 } : { wpx: 400 })), // 셀 너비 설정, 필수 X
      addRowColor: { rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }, // 색상 넣을 행(rgb #빼고 입력), 필수 X
      // addLineHeader: ['발행일시\nTT'], // 줄바꿈 원하는곳에 \n 넣기!! - br Tag 외 \n, p, span 등 줄바꿈 안되는 헤더명 입력, 필수 X
      sheetName: '', // 시트이름, 필수 X
      ...excelOption,
      target: tableRef?.current || excelOption?.target,
    });
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
