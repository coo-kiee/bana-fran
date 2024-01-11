import { useRef } from 'react';

// Const
import { CALCULATE_TITLE, CALCULATE_TYPE, SearchDate } from 'constants/calculate/common';
import {
  STAMP_COUPON_DETAIL_TOTAL_INFO,
  STAMP_COUPON_DETAIL_COLGROUP_INFO,
  STAMP_COUPON_DETAIL_THEAD_INFO,
  STAMP_COUPON_CHARGE_MULTIPLY,
  StampCouponDetailFilterOption,
} from 'constants/calculate/stampCoupon';

// Hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// API
import { useCalculateStampCouponDetailList } from 'service/calculateService';

// Util
import Utils from 'utils/Utils';
import { sumStampCouponDetailTotalInfo } from 'utils/calculate/sumStampCouponDetailTotalInfo';

// Component
import Table from 'pages/common/table';
import TableTotalInfo from '../../common/table/TableTotalInfo';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';
import useStampCouponFilterCondition from 'hooks/calculate/stamp-coupon/useStampCouponFilterCondition';

interface IStampCouponDetailTable {
  searchDate: SearchDate;
  filterCondition: Record<keyof StampCouponDetailFilterOption, string>;
}
const StampCouponDetailTable = ({ searchDate, filterCondition }: IStampCouponDetailTable) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const { user } = useUserInfo();
  const { filterData } = useStampCouponFilterCondition();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
  };

  // Query
  const stampCouponDetailListRes = useCalculateStampCouponDetailList(params);
  useHandlePageDataCnt(stampCouponDetailListRes, filterCondition, filterData);

  return (
    <>
      <TableTotalInfo
        fromDate={searchDate.fromDate}
        toDate={searchDate.toDate}
        queryRes={stampCouponDetailListRes}
        initialDetailTotalInfo={STAMP_COUPON_DETAIL_TOTAL_INFO}
        sumFn={sumStampCouponDetailTotalInfo}
      />
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={STAMP_COUPON_DETAIL_COLGROUP_INFO} />
        <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={STAMP_COUPON_DETAIL_THEAD_INFO} />
        <Table.TableList
          queryRes={stampCouponDetailListRes}
          render={(datas) =>
            datas
              ?.filter((stampCouponDetail) => filterData(filterCondition, stampCouponDetail))
              .map((stampCouponDetail, index) => {
                const display = checkCurrentPageData(index) ? '' : 'none';

                return (
                  <tr key={index} style={{ display }}>
                    <td className="align-center">{stampCouponDetail.use_date}</td>
                    <td className="align-center">{stampCouponDetail.calc_type}</td>
                    <td className="align-center">{stampCouponDetail.sTitle}</td>
                    <td className="align-center">{stampCouponDetail.use_fcode_name}</td>
                    <td className="align-right">{Utils.numberComma(stampCouponDetail.coupon_use_charge || '')}</td>
                    <td className="align-center">{Utils.numberComma(stampCouponDetail.stamp_count || '')}</td>
                    <td className="align-right">{Utils.numberComma(stampCouponDetail.one_charge || '')}</td>
                    <td className="align-right">{Utils.numberComma(stampCouponDetail.stamp_charge || '')}</td>
                    <td className="align-right">{Utils.numberComma(stampCouponDetail.hd_charge || '')}</td>
                    <td className="align-right">{Utils.numberComma(stampCouponDetail.total_amt || '')}</td>
                    <td className="align-right">
                      {Utils.numberComma(
                        stampCouponDetail.supply_amt * STAMP_COUPON_CHARGE_MULTIPLY[stampCouponDetail.calc_type],
                      )}
                    </td>
                    <td className="align-right">
                      {Utils.numberComma(
                        stampCouponDetail.vat_amt * STAMP_COUPON_CHARGE_MULTIPLY[stampCouponDetail.calc_type],
                      )}
                    </td>
                    <td className="align-right">
                      <strong>
                        {Utils.numberComma(
                          stampCouponDetail.total_amt * STAMP_COUPON_CHARGE_MULTIPLY[stampCouponDetail.calc_type],
                        )}
                      </strong>
                    </td>
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
          fileName={`${user.fCodeName}_${CALCULATE_TITLE[CALCULATE_TYPE.STAMP_COUPON]}(${searchDate.fromDate}~${
            searchDate.toDate
          })`}
          sheetOption={{ origin: 'B3' }}
          colWidths={Object.values(STAMP_COUPON_DETAIL_COLGROUP_INFO).flatMap((item) =>
            item.width !== '*' ? { wpx: Number(item.width) * 1.2 } : { wpx: 400 },
          )}
          addRowColor={{ rowNums: [1], colors: ['d3d3d3'] }}
        />
        <Pages />
      </div>
    </>
  );
};

export default StampCouponDetailTable;
