// Util
import Utils from 'utils/Utils';

// Hook
import useUserInfo from 'hooks/user/useUser';
import { useContext } from 'react';
import { PageInfoContext } from '../pagination/PageInfoProvider';

interface IExcelButton<T> {
  titleFrom: string;
  titleTo: string;
  colspan: T;
  tableRef: React.MutableRefObject<HTMLTableElement | null>;
  excelFileName: string;
}
const ExcelButton = <T,>({ titleFrom, titleTo, colspan, tableRef, excelFileName }: IExcelButton<T>) => {
  const { user } = useUserInfo();
  const pageInfo = useContext(PageInfoContext);

  if (!pageInfo.dataCnt) return null;

  const excelDownload = () => {
    if (tableRef.current) {
      // Excel - sheet options: 셀 시작 위치, 셀 크기
      const options = {
        type: 'table', // 필수 O
        sheetOption: { origin: 'B3' }, // 해당 셀부터 데이터 표시, default - A1, 필수 X
        colspan: (colspan as unknown as []).map((wpx) => (wpx !== '*' ? { wpx: Number(wpx) * 1.2 } : { wpx: 400 })), // 셀 너비 설정, 필수 X
        addRowColor: { row: [1, 2], color: ['d3d3d3', 'd3d3d3'] }, // 색상 넣을 행(rgb #빼고 입력), 필수 X
        // addLineHeader: ['발행일시\nTT'], // 줄바꿈 원하는곳에 \n 넣기!! - br Tag 외 \n, p, span 등 줄바꿈 안되는 헤더명 입력, 필수 X
        sheetName: '', // 시트이름, 필수 X
      };

      const fileName = `${user.fCodeName}_${excelFileName}(${titleFrom}~${titleTo})`;

      Utils.excelDownload(tableRef.current, options, fileName);
    }
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
