import { useRef } from 'react';

// Type
import { CALCULATE_TITLE, CALCULATE_TYPE, SearchDate } from 'constants/calculate/common';
import {
  CouponDetailFilterOption,
  COUPON_DETAIL_COLGROUP_INFO,
  COUPON_DETAIL_THEAD_INFO,
} from 'constants/calculate/coupon';

// API
import { useCalculateCouponDetailList } from 'service/calculateService';

// Hook
import useUserInfo from 'hooks/user/useUser';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import useCouponFilterCondition from 'hooks/calculate/coupon/useCouponFilterCondition';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useCouponDetailInitialTotalInfo from 'hooks/calculate/coupon/useCouponDetailInitialTotalInfo';

// Util
import Utils from 'utils/Utils';
import { sumCouponDetailTotalInfo } from 'utils/calculate/sumCouponDetailTotalInfo';

// Component
import Table from 'pages/common/table';
import TableTotalInfo from '../../common/table/TableTotalInfo';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';

interface ICouponDetailTable {
  searchDate: SearchDate;
  filterCondition: Record<keyof CouponDetailFilterOption, string>;
}
const CouponDetailTable = ({ searchDate, filterCondition }: ICouponDetailTable) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const { user } = useUserInfo();
  const { filterData } = useCouponFilterCondition();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
  };

  // Query
  const couponDetailListRes = useCalculateCouponDetailList(params);
  useHandlePageDataCnt(couponDetailListRes, filterCondition, filterData);

  const initialDetailTotalInfo = useCouponDetailInitialTotalInfo();

  return (
    <>
      <TableTotalInfo
        fromDate={searchDate.fromDate}
        toDate={searchDate.toDate}
        queryRes={couponDetailListRes}
        initialDetailTotalInfo={initialDetailTotalInfo}
        sumFn={sumCouponDetailTotalInfo}
      />
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={COUPON_DETAIL_COLGROUP_INFO} />
        <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={COUPON_DETAIL_THEAD_INFO} />
        <Table.TableList
          queryRes={couponDetailListRes}
          render={(datas) =>
            datas
              ?.filter((couponDetail) => filterData(filterCondition, couponDetail))
              .map((couponDetail, index) => {
                const display = checkCurrentPageData(index) ? '' : 'none';

                return (
                  <tr key={index} style={{ display }}>
                    <td className="align-center">{couponDetail.rcp_date.split(' ')[0]}</td>
                    <td className="align-left">{couponDetail.item_type}</td>
                    <td className="align-center">{couponDetail.sItem}</td>
                    <td className="align-right">{Utils.numberComma(couponDetail.total_amt)}</td>
                    <td className="align-center">{couponDetail.rcp_type}</td>
                    <td className="align-center">{couponDetail.phone}</td>
                    <td className="align-right">{Utils.numberComma(couponDetail.supply_amt)}</td>
                    <td className="align-right">{Utils.numberComma(couponDetail.vat_amt)}</td>
                    <td className="align-right">{Utils.numberComma(couponDetail.total_amt)}</td>
                  </tr>
                );
              })
          }
        />
      </Table>
      <div className="result-function-wrap">
        <ExcelButton
          type={'table'}
          target={tableRef}
          tableRef={tableRef}
          fileName={`${user.fCodeName}_${CALCULATE_TITLE[CALCULATE_TYPE.COUPON]}(${searchDate.fromDate}~${
            searchDate.toDate
          })`}
          sheetOption={{ origin: 'B3' }}
          colWidths={Object.values(COUPON_DETAIL_COLGROUP_INFO).flatMap((item) =>
            item.width !== '*' ? { wpx: Number(item.width) * 1.2 } : { wpx: 400 },
          )}
          addRowColor={{ rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }}
        />
        <Pages />
      </div>
    </>
  );
};

export default CouponDetailTable;
