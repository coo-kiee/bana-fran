import { FC, ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// API
import CALCULATE_SERVICE from 'service/calculateService';

// Type
import {
  CalculateType,
  CALCULATE_TYPE,
  CALCULATE_CHARGE_TYPE,
  CALCULATE_CHARGE_MULTIPLY,
  AffilateTabType,
  AFFILIATE_TAB_TYPE,
} from 'types/calculate/calculateType';

// Util
import Utils from 'utils/Utils';

// Component
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import NoData from 'pages/common/noData';
import useUserInfo from 'hooks/user/useUser';

interface CalculateLastMonthTableProps {
  userInfo?: {
    f_code: number;
    f_code_name: string;
    staff_no: number;
  };
  caculateType: CalculateType | AffilateTabType;
}
const CalculateLastMonthTable: FC<CalculateLastMonthTableProps> = ({ caculateType }) => {
  const now = new Date();
  const lastMonthDate = new Date(now.setMonth(now.getMonth() - 1));
  const year = lastMonthDate.getFullYear();
  const month = lastMonthDate.getMonth() + 1;

  const { width, headerText } = TABLE_COLUMN_INFO[caculateType as keyof typeof TABLE_COLUMN_INFO];

  return (
    <>
      <p className="title bullet">
        {year}년 {month}월 {TABLE_COLUMN_INFO[caculateType as keyof typeof TABLE_COLUMN_INFO].title}
      </p>
      <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        {/* Column Width */}
        <colgroup>
          {width.map((wd, index) => (
            <col width={wd} key={index} />
          ))}
        </colgroup>
        <tbody>
          {/* Table Header  */}
          <tr>
            {headerText.map((text) => (
              <th key={text}>{text}</th>
            ))}
          </tr>
          {/* List */}
          <ErrorBoundary
            fallbackRender={({ resetErrorBoundary }) => (
              <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
            )}
            onError={(e) => console.log('CouponDetail')}
          >
            <Suspense fallback={<Loading height={80} width={80} marginTop={0} isTable={true} />}>
              <TableList colSpan={width.length} caculateType={caculateType} />
            </Suspense>
          </ErrorBoundary>
        </tbody>
      </table>
    </>
  );
};

export default CalculateLastMonthTable;

interface TableListProps {
  fCode?: number;
  staffNo?: number;
  colSpan: number;
  caculateType: CalculateType | AffilateTabType;
}
const TableList: FC<TableListProps> = ({ colSpan, caculateType }) => {
  const { user } = useUserInfo();
  const { data: calculateDetailSumList } = CALCULATE_SERVICE.useCalculateLastMonthEach(
    user.fCode,
    user.staffNo,
    caculateType,
  );
  const totalInfo =
    caculateType === CALCULATE_TYPE.ETC ? { text: '합계', colSpan: 2, supply: 0, vat: 0, total: 0 } : {};

  return (
    <>
      {calculateDetailSumList?.reduce((res, calculateDetailSum, index, arr) => {
        const { from_date, to_date, calculate_type, item_name, supply_amt, vat_amt, total_amt } = calculateDetailSum;

        // 기타 정산 내역 - 금액 곱셈값
        const multiply =
          calculate_type && calculate_type === CALCULATE_CHARGE_TYPE.BILLING
            ? CALCULATE_CHARGE_MULTIPLY[CALCULATE_CHARGE_TYPE.BILLING]
            : CALCULATE_CHARGE_MULTIPLY[CALCULATE_CHARGE_TYPE.CONSERVATION];
        const supplyAmt = supply_amt * multiply;
        const vatAmt = vat_amt * multiply;
        const totalAmt = total_amt * multiply;

        // 기타 정산 내역 합계 계산
        if (calculate_type && totalInfo.text) {
          totalInfo.supply += supplyAmt;
          totalInfo.vat += vatAmt;
          totalInfo.total += totalAmt;
        }

        //  // 기타 정산 내역 합계 Row 추가
        if (caculateType === AFFILIATE_TAB_TYPE.COUPON) {
          res.push(
            <tr key={index}>
              <td className="align-center">{`${from_date}~${to_date}`}</td>
              {calculate_type && <td className="align-center">{calculate_type}</td>}
              <td className="align-left">{item_name}</td>
              <td className="align-center">{calculateDetailSum.publisher}</td>
              <td className="align-right">{Utils.numberComma(supplyAmt)}</td>
              <td className="align-right">{Utils.numberComma(vatAmt)}</td>
              <td className="align-right">{Utils.numberComma(totalAmt)}</td>
            </tr>,
          );
          return res;
        }

        res.push(
          <tr key={index}>
            <td className="align-center">{`${from_date}~${to_date}`}</td>
            {calculate_type && <td className="align-center">{calculate_type}</td>}
            <td className="align-left">{item_name}</td>
            <td className="align-right">{Utils.numberComma(supplyAmt)}</td>
            <td className="align-right">{Utils.numberComma(vatAmt)}</td>
            <td className="align-right">{Utils.numberComma(totalAmt)}</td>
          </tr>,
        );

        // 기타 정산 내역 합계 Row 추가
        if (calculate_type && index === arr.length - 1) {
          res.push(
            <tr key={index + 1}>
              <td className="align-center">{`${from_date}~${to_date}`}</td>
              <td className="align-center" colSpan={totalInfo.colSpan}>
                {totalInfo.text}
              </td>
              <td className="align-right">{Utils.numberComma(totalInfo.supply)}</td>
              <td className="align-right">{Utils.numberComma(totalInfo.vat)}</td>
              <td className="align-right">{Utils.numberComma(totalInfo.total)}</td>
            </tr>,
          );
        }
        return res;
      }, [] as ReactNode[])}
      {calculateDetailSumList?.length === 0 && <NoData isTable={true} />}
    </>
  );
};

// Component Type
const TABLE_COLUMN_INFO = {
  [CALCULATE_TYPE.POINT]: {
    title: '유상포인트 결제내역',
    width: ['218', '*', '130', '130', '130'],
    headerText: ['정산기간', '품목', '공급가액', '부가세', '합계'],
  },
  [CALCULATE_TYPE.COUPON]: {
    title: '본사 쿠폰 결제 내역',
    width: ['218', '*', '130', '130', '130'],
    headerText: ['정산기간', '품목', '공급가액', '부가세', '합계'],
  },
  [CALCULATE_TYPE.CLAIM]: {
    title: '클레임 쿠폰 정산내역',
    width: ['218', '*', '130', '130', '130'],
    headerText: ['정산기간', '품목', '공급가액', '부가세', '합계'],
  },
  [CALCULATE_TYPE.ETC]: {
    title: '기타 정산 내역',
    width: ['188', '70', '*', '130', '130', '130'],
    headerText: ['정산기간', '구분', '품목', '공급가액', '부가세', '합계'],
  },
  [AFFILIATE_TAB_TYPE.COUPON]: {
    title: '제휴사 쿠폰/포인트 결제내역',
    width: ['188', '*', '*', '130', '130', '130'],
    headerText: ['정산기간', '품목', '발행사', '공급가액', '부가세', '합계'],
  },
} as const;
