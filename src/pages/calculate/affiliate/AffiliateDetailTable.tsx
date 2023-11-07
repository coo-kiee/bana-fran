import { useRef } from 'react';

// Const
import {
  AffiliateTabType,
  AFFILIATE_DETAIL_TABLE_COLGROUP_INFO,
  AFFILIATE_DETAIL_TABLE_THEAD_INFO,
  AFFILIATE_DETAIL_TOTAL_INFO,
} from 'constants/calculate/affiliate';

// Type
import { CALCULATE_TITLE, SearchDate } from 'constants/calculate/common';

// Hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// API
import { useCalculateAffiliateDetailList } from 'service/calculateService';

// Util
import Utils from 'utils/Utils';
import { sumAffiliateDetailTotalInfo } from 'utils/calculate/sumAffiliateDetailTotalInfo';

// Component
import TableTotalInfo from '../../common/table/TableTotalInfo';
import Table from 'pages/common/table';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';

interface IAffiliateDetailTable {
  tabType: AffiliateTabType;
  searchDate: SearchDate;
}
const AffiliateDetailTable = ({ searchDate, tabType }: IAffiliateDetailTable) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const { user } = useUserInfo();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
  };

  // Query
  const affiliateDetailListRes = useCalculateAffiliateDetailList({ params, tabType });
  useHandlePageDataCnt(affiliateDetailListRes);

  return (
    <>
      <TableTotalInfo
        fromDate={searchDate.fromDate}
        toDate={searchDate.toDate}
        queryRes={affiliateDetailListRes}
        initialDetailTotalInfo={AFFILIATE_DETAIL_TOTAL_INFO[tabType]}
        sumFn={sumAffiliateDetailTotalInfo}
      />
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={AFFILIATE_DETAIL_TABLE_COLGROUP_INFO[tabType]} />
        <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={AFFILIATE_DETAIL_TABLE_THEAD_INFO[tabType]} />
        <Table.TableList
          queryRes={affiliateDetailListRes}
          render={(datas) =>
            datas?.map((affiliateData, index) => (
              <tr key={index} style={{ display: checkCurrentPageData(index) ? '' : 'none' }}>
                <td className="align-left">{affiliateData.use_date.substring(0, 10)}</td>
                <td className="align-left">{affiliateData.coupon_title}</td>
                <td className="align-center">{affiliateData.publisher}</td>
                <td className="align-center">{affiliateData.menu_name}</td>
                <td className="align-center">{affiliateData.phone}</td>
                <td className="align-right">{Utils.numberComma(affiliateData.apply_charge)}</td>
                <td className="align-right">{Utils.numberComma(affiliateData.supply_amt)}</td>
                <td className="align-right">{Utils.numberComma(affiliateData.vat_amt)}</td>
                <td className="align-right">{Utils.numberComma(affiliateData.total_amt)}</td>
              </tr>
            ))
          }
        />
      </Table>
      <div className="result-function-wrap">
        <ExcelButton
          type={'table'}
          target={tableRef}
          tableRef={tableRef}
          fileName={`${user.fCodeName}_${CALCULATE_TITLE[tabType]}(${searchDate.fromDate}~${searchDate.toDate})`}
          sheetOption={{ origin: 'B3' }}
          colWidths={Object.values(AFFILIATE_DETAIL_TABLE_COLGROUP_INFO[tabType]).flatMap((item) =>
            item.width !== '*' ? { wpx: Number(item.width) * 1.2 } : { wpx: 400 },
          )}
          addRowColor={{ rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }}
        />
        <Pages />
      </div>
    </>
  );
};

export default AffiliateDetailTable;
