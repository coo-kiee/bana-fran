import { ColInfo, utils, WorkSheet, writeFile } from 'xlsx-js-style';

/**
 * @param type - 'array' | 'object' | 'table'
 * @param target - 엑셀 데이터 대상
 * @param fileName - 엑셀파일 이름, .xlsx 제외
 * @param colWidths - 컬럼 Size
 * @param sheetOption - 해당 셀부터 데이터 표시
 * @param sheetName - 시트 이름
 * @param addRowColor - 색상 넣을 행
 * @param addLineHeader - 줄바꿈 원하는 곳, br Tag 외 \n, p, span 등 줄바꿈 안되는 헤더명 입력
 *
 * @example - {
 *  type: 'table',
 *  target: tableRef.current
 *  fileName?: '엑셀',
 *  colWidths?: { wpx: number }[],
 *  sheetOption?: { origin: 'A1' },
 *  sheetName?: '시트',
 *  addRowColor?: { rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] },
 *  addLineHeader?: ['발행일시\nTT'],
 * }
 */
export interface IExcelDownload {
  type: 'table' | 'array' | 'object';
  target: any;
  fileName?: string;
  colWidths?: ColInfo[];
  sheetOption?: { origin: string };
  sheetName?: string;
  addRowColor?: { rowNums: number[]; colors: string[] };
  addLineHeader?: string[];
}

const addSheet = (target: any, type: IExcelDownload['type'], sheetOption: IExcelDownload['sheetOption']) => {
  let workSheet;
  switch (type.toLowerCase()) {
    case 'table':
      workSheet = utils.table_to_sheet(target, { ...sheetOption, raw: true });
      // console.log('여기1', workSheet);
      break;
    case 'array': // const file1 = [ ["이름", "나이"], ["장민우", "31"], ]
      workSheet = utils.aoa_to_sheet(target);
      break;
    case 'object': // const file2 = [ { A: "학과", B: "직급", C: "이름", D: "나이" }, { A: "흉부외과", B: "의사", C: "장민우", D: "31" }, ]
      workSheet = utils.json_to_sheet(target);
      break;
    default:
      break;
  }

  return workSheet;
};

const setCellSize = (workSheet: WorkSheet, colWidths: IExcelDownload['colWidths'], origin: string) => {
  // const { c: originCol, r: originRow } = utils.decode_cell(origin);
  const { c: originCol } = utils.decode_cell(origin);

  // 셀 너비 설정
  if (!(origin === 'A1')) {
    // A1 셀에서 시작하지 않을 때 빈 셀 너비 설정 추가
    for (let index = 0; index < originCol; index++) {
      workSheet['!cols']?.push({ wpx: 40 });
    }
  }

  workSheet['!cols'] = [...(workSheet['!cols'] || []), ...(colWidths || [])];
};

const handleRowHidden = (workSheet: WorkSheet) => {
  workSheet['!rows']?.forEach((item) => (item.hidden = false));
};

// const setStyle = (workSheet: WorkSheet, addRowColor:, ) => {

// }

const getColorCellGroup = (
  workSheet: WorkSheet,
  sheetOption: IExcelDownload['sheetOption'],
  addRowColor: IExcelDownload['addRowColor'],
) => {
  if (!addRowColor || !sheetOption) return {};

  const { c: originCol, r: originRow } = utils.decode_cell(sheetOption.origin);

  const cellRange = utils.decode_range(String(workSheet['!ref']));
  const addColorCellGroup = addRowColor.rowNums.reduce(
    (arr, rowNum) => ({ ...arr, [rowNum]: [] }),
    {} as Record<number, string[]>,
  );

  // 엑셀 테두리 설정
  const defaultBorderStyle = { style: 'thin', color: { rgb: '#000000' } };
  const border = {
    top: defaultBorderStyle,
    bottom: defaultBorderStyle,
    left: defaultBorderStyle,
    right: defaultBorderStyle,
  };

  for (let row = originRow; row <= cellRange.e.r; row++) {
    for (let col = originCol; col <= cellRange.e.c; col++) {
      const cellName = utils.encode_cell({ c: col, r: row });
      // console.log(cellName);
      workSheet[cellName] = { ...workSheet[cellName], s: { border }, v: workSheet[cellName]?.v || '' }; // 테두리 설정
      if (addRowColor.rowNums.length > 0 && addRowColor.rowNums.includes(row + 1 - originRow) && originCol <= col) {
        addColorCellGroup[row + 1 - originRow].push(cellName); // addRowColorCellGroup 수집
      }
    }
  }

  return addColorCellGroup;
};

const setCellData = (
  workSheet: WorkSheet,
  addColorCellGroup: Record<number, string[]>,
  addRowColor: IExcelDownload['addRowColor'],
  addLineHeader: IExcelDownload['addLineHeader'],
) => {
  const isSellAddress = /[A-Z]{1,3}\d{1,5}/;
  const isCharge = /^[+-]?([0-9]{1,3}(,[0-9]{3})*)$/;
  const checkAddLineHeader = addLineHeader?.map((item) => item?.replace('\n', ' ')); // 라인 추가할 헤더 체크값 변환

  Object.entries(workSheet).reduce((res, [cellPosition, cellData]) => {
    // 숫자 - 3자리마다 ',' 표시 / 숫자 타입으로 변경 / 문자열 ,(콤마) 및 +기호 제거 / 오른쪽 정렬 : 텍스트 - 가운데 정렬
    // if (value.t && isSellAddress.test(key)) res[key] = value.t !== 'n' ? { ...value, s: { ...value.s, alignment: { vertical: "center", horizontal: "center", wrapText: true } } } : { ...value, z: "#,##0", s: { ...value.s, alignment: { vertical: "center", horizontal: "right" } } };
    if (cellData.t && isSellAddress.test(cellPosition))
      res[cellPosition] = isCharge.test(cellData.v)
        ? {
            ...cellData,
            z: '#,##0',
            t: 'n',
            v: cellData.v.replaceAll(/[,+]/g, ''),
            s: { ...cellData.s, alignment: { vertical: 'center', horizontal: 'right', wrapText: true } },
          }
        : {
            ...cellData,
            s: { ...cellData.s, alignment: { vertical: 'center', horizontal: 'center', wrapText: true } },
          };

    // addRowColor 행의 색상 추가
    addRowColor?.rowNums?.forEach((rowNum, index) => {
      if (addColorCellGroup[rowNum]?.includes(cellPosition))
        res[cellPosition].s = {
          ...res[cellPosition].s,
          fill: { fgColor: { rgb: addRowColor.colors[index] || 'd3d3d3' } },
        };
    });

    if (!cellData.v && cellData.t && cellData.t === 'z') res[cellPosition].t = 's'; // 빈 데이터(공백) 타입 문자열로 변경
    if (addLineHeader && checkAddLineHeader?.length && checkAddLineHeader.indexOf(cellData.v) >= 0)
      res[cellPosition].v = addLineHeader[checkAddLineHeader.indexOf(cellData.v)];

    return res;
  }, workSheet);
};

export const downloadExcel = ({
  target,
  type = 'table',
  sheetOption = { origin: 'A1' },
  colWidths = [],
  sheetName = '',
  fileName = 'excel',
  addRowColor = { rowNums: [], colors: [] },
  addLineHeader = [],
}: IExcelDownload) => {
  if (!target) return '출력 대상이 없습니다.';

  const workSheet = addSheet(target, type, sheetOption);

  if (!workSheet) return '워크시트 생성에 실패했습니다.';

  setCellSize(workSheet, colWidths, sheetOption.origin);

  handleRowHidden(workSheet);

  const addColorCellGroup = getColorCellGroup(workSheet, sheetOption, addRowColor);

  setCellData(workSheet, addColorCellGroup, addRowColor, addLineHeader);

  // 엑셀 워크북 생성
  const book = utils.book_new();

  utils.book_append_sheet(book, workSheet, sheetName);

  writeFile(book, `${fileName}.xlsx`);

  return '';
};
