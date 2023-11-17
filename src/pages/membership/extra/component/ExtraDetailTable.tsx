import { FC, useRef } from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Utils from 'utils/Utils';

// type, constant
import { SearchDate } from 'constants/calculate/common';
import { ETC_COL_THEAD_LIST } from 'constants/etc';
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';
import { MEMBERSHIP_COL_THEAD_LIST } from 'constants/membership';

// hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';
import Sticky from 'pages/common/sticky';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

// service
import MEMBERSHIP_SERVICE from 'service/membershipService';

const ExtraDetailTable: FC<{ searchDate: SearchDate; pageType: MEMBERSHIP_PAGE_TYPE }> = ({
  searchDate: { fromDate, toDate },
  pageType,
}) => {
  const {
    user: { fCode, fCodeName },
  } = useUserInfo();
  const { reset } = useQueryErrorResetBoundary();
  const tableRef = useRef<HTMLTableElement>(null);
  const thRef = useRef<HTMLTableRowElement>(null);
  const { checkCurrentPageData } = usePageInfo();
  const listData = MEMBERSHIP_SERVICE.useMembershipList(
    ['membership_extra_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );

  useHandlePageDataCnt(listData);

  return (
    <>
      <Sticky reference={thRef.current} contentsRef={tableRef.current}>
        <Table.ColGroup colGroupAttributes={MEMBERSHIP_COL_THEAD_LIST[pageType].colgroup} />
        <Table.TableHead thData={EXTRA_DETAIL_LIST.thead} />
      </Sticky>
      <Table className="board-wrap" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={MEMBERSHIP_COL_THEAD_LIST[pageType].colgroup} />
        <Table.TableHead thData={EXTRA_DETAIL_LIST.thead} trRef={thRef} />
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
          )}
        >
          <Table.TableList
            queryRes={listData}
            render={(datas) =>
              datas?.map(
                (
                  {
                    std_date,
                    total_stamp_cnt,
                    convert_coupon_stamp_cnt,
                    expired_stamp_cnt,
                    total_coupon_cnt,
                    total_coupon_amount,
                    used_coupon_cnt,
                    used_coupon_amount,
                    expired_coupon_cnt,
                    expired_coupon_amount,
                    total_point,
                    used_point,
                    expired_point,
                  },
                  index,
                ) => (
                  <tr key={index} style={{ display: checkCurrentPageData(index) ? '' : 'none' }}>
                    <td className={index === 0 ? 'total' : ''}>{std_date}</td>
                    <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(total_stamp_cnt)}개</td>
                    <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(convert_coupon_stamp_cnt)}개</td>
                    <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(expired_stamp_cnt)}개</td>
                    <td className={index === 0 ? 'total' : ''}>
                      {Utils.numberComma(total_coupon_cnt)}개<p>({Utils.numberComma(total_coupon_amount)}원)</p>
                    </td>
                    <td className={index === 0 ? 'total' : ''}>
                      {Utils.numberComma(used_coupon_cnt)}개<p>({Utils.numberComma(used_coupon_amount)}원)</p>
                    </td>
                    <td className={index === 0 ? 'total' : ''}>
                      {Utils.numberComma(expired_coupon_cnt)}개<p>({Utils.numberComma(expired_coupon_amount)}원)</p>
                    </td>
                    <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(total_point)}P</td>
                    <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(used_point)}P</td>
                    <td className={index === 0 ? 'total' : ''}>{Utils.numberComma(expired_point)}P</td>
                  </tr>
                ),
              )
            }
          />
        </ErrorBoundary>
      </Table>
      <div className="result-function-wrap">
        <ExcelButton
          type={'table'}
          target={tableRef}
          tableRef={tableRef}
          sheetOption={{ origin: 'B3' }}
          colWidths={ETC_COL_THEAD_LIST[pageType].colgroup.map(({ width }) =>
            width !== '*' ? { wpx: Number(width) } : { wpx: 400 },
          )}
          fileName={`${fromDate}~${toDate}_${fCodeName}_멤버십누적내역`}
          addRowColor={{ rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }}
        />
        <Pages />
      </div>
    </>
  );
};

export default ExtraDetailTable;

const EXTRA_DETAIL_LIST = {
  thead: [
    [
      { children: '일시', rowSpan: 2 },
      { children: '스탬프', colSpan: 3, className: 'price-area boder-th-b' },
      { children: '무료음료쿠폰(스탬프적립&월간랭킹보상)', colSpan: 3, className: 'boder-th-a' },
      { children: '바나포인트 (적립&월간랭킹보상)', colSpan: 3, className: 'price-area boder-th-b' },
    ],
    [
      { children: '지급 수', className: 'price-area height-63' },
      { children: '쿠폰전환 수', className: 'price-area height-63' },
      { children: '유효기간 소멸 수', className: 'price-area height-63' },
      {
        children: (
          <>
            발급 수<p>(금액)</p>
          </>
        ),
        className: 'height-63',
      },
      {
        children: (
          <>
            사용 수<p>(금액)</p>
          </>
        ),
        className: 'height-63',
      },
      {
        children: (
          <>
            유효기간 소멸 수<p>(금액)</p>
          </>
        ),
        className: 'height-63',
      },
      { children: '적립', className: 'price-area height-63' },
      { children: '사용', className: 'price-area height-63' },
      { children: '유효기간 소멸', className: 'price-area height-63' },
    ],
  ],
};
