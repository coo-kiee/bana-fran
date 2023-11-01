import { RefObject } from 'react';

// Const
import {
  AffiliateTabType,
  AFFILIATE_DETAIL_TABLE_COLGROUP_INFO,
  AFFILIATE_DETAIL_TABLE_THEAD_INFO,
  AFFILIATE_DETAIL_TOTAL_INFO,
} from 'constants/calculate/affiliate';

// Type
import { SearchDate } from 'constants/calculate/common';

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
import CalculateDetailTotalInfo from '../component/CalculateDetailTotalInfo';
import Table from 'pages/common/table';

interface IAffiliateDetailTable {
  tableRef: RefObject<HTMLTableElement>;
  tabType: AffiliateTabType;
  searchDate: SearchDate;
}
const AffiliateDetailTable = ({ tableRef, searchDate, tabType }: IAffiliateDetailTable) => {
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
      <CalculateDetailTotalInfo
        searchDate={searchDate}
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
    </>
  );
};

export default AffiliateDetailTable;
