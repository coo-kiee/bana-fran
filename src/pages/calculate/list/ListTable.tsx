import { useRef } from 'react';

// Hook
import useUserInfo from 'hooks/user/useUser';
import useModal from 'hooks/common/useModal';

// Const
import { LIST_TABLE_COLUMN_INFO, LIST_THEAD_INFO } from 'constants/calculate/list';
import { CALCULATE_EXCEL_FILENAME } from 'constants/calculate/common';
import { CALCULATE_TYPE } from 'types/calculate/calculateType';
import { ETC_CHARGE_MULTIPLY } from 'constants/calculate/etc';

// API
import { useCalculateLastMonthTotal } from 'service/calculateService';

// Util
import Utils from 'utils/Utils';

// Component
import Table from 'pages/common/table';
import ExcelButton from 'pages/common/excel/ExcelButton';
import ListTableItem from './ListTableItem';
import ListButtons from './ListButtons';
import PDFContainer from 'pages/common/pdf';

interface IListTable {
  selectDate: string;
}
const ListTable = ({ selectDate }: IListTable) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const { user } = useUserInfo();

  const { openModal } = useModal();

  const lastMonthTotalRes = useCalculateLastMonthTotal({ f_code: user.fCode, std_month: selectDate });
  const sumAll = Utils.numberComma(
    lastMonthTotalRes.data?.list.reduce(
      (arr, cur) => (arr += cur.total_amt * ETC_CHARGE_MULTIPLY[cur.calculate_type]),
      0,
    ),
  );

  const handlePdf = () => {
    openModal({
      type: 'CUSTOM',
      component: (
        <PDFContainer fileName={`${user.fCodeName}_정산내역 확인(${selectDate})`}>
          <div style={{ textAlign: 'center', fontSize: '30px', marginBottom: '30px' }}>
            <span style={{ fontWeight: 'bold', color: '#f1658a' }}>{selectDate.replace('-', '년 ')}월</span>{' '}
            {user.fCodeName} 정산내역 확인
          </div>
          <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
            <Table.ColGroup colGroupAttributes={LIST_TABLE_COLUMN_INFO} />
            <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={LIST_THEAD_INFO} />
            <Table.TableList
              queryRes={lastMonthTotalRes}
              isPagination={false}
              render={(data) => <ListTableItem data={data} />}
            />
          </Table>
          <div className="result-function-wrap">
            <div></div>
            <div className="result">
              합계 :<span>{sumAll}</span>
            </div>
          </div>
        </PDFContainer>
      ),
    });
  };

  return (
    <>
      <div>
        <ListButtons lastMonthTotalRes={lastMonthTotalRes} />
        <p className="title">
          <span className="sub-title hyphen">
            '보전'은 본사로부터 보전받을 금액이며, '청구'는 본사가 가맹점에 청구하는 금액을 의미합니다.
          </span>
        </p>
      </div>
      <Table tableRef={tableRef} className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <Table.ColGroup colGroupAttributes={LIST_TABLE_COLUMN_INFO} />
        <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={LIST_THEAD_INFO} />
        <Table.TableList
          queryRes={lastMonthTotalRes}
          isPagination={false}
          render={(data) => <ListTableItem data={data} />}
        />
      </Table>
      {!!lastMonthTotalRes.data?.list.length && (
        <div className="result-function-wrap">
          <div style={{ display: 'flex' }}>
            <ExcelButton
              dataCnt={lastMonthTotalRes.data?.list.length}
              type={'table'}
              target={tableRef}
              tableRef={tableRef}
              fileName={`${user.fCodeName}_${CALCULATE_EXCEL_FILENAME[CALCULATE_TYPE.LIST]}(${selectDate}`}
              sheetOption={{ origin: 'B3' }}
              colWidths={Object.values(LIST_TABLE_COLUMN_INFO).flatMap((item) =>
                item.width !== '*' ? { wpx: Number(item.width) * 1.2 } : { wpx: 400 },
              )}
              addRowColor={{ rowNums: [1], colors: ['d3d3d3'] }}
            />
            &nbsp;
            <div className="function">
              <button className="goast-btn" onClick={handlePdf}>
                인쇄
              </button>
            </div>
          </div>
          <div className="result">
            합계 :<span>{sumAll}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ListTable;
