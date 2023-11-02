import React, { FC, RefObject } from 'react';

// Type
import { SearchDate } from 'constants/calculate/common';
import { ClaimTabType, CLAIM_TAB_TYPE } from 'types/calculate/calculateType';
import {
  CLAIM_DETAIL_TABLE_COLGROUP_INFO,
  CLAIM_DETAIL_TABLE_THEAD_INFO,
  CLAIM_DETAIL_TOTAL_INFO,
} from 'constants/calculate/claim';

// Util
import Utils from 'utils/Utils';
import { sumClaimDetailTotalInfo } from 'utils/calculate/sumClaimDetailTotalInfo';

// API
import { useCalculateClaimDetailList } from 'service/calculateService';

// Hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import useUserInfo from 'hooks/user/useUser';
import usePageInfo from 'hooks/pagination/usePageInfo';

// Component
import Table from 'pages/common/table';
import TableTotalInfo from '../../common/table/TableTotalInfo';

interface IClaimDetailTable {
  tableRef: RefObject<HTMLTableElement>;
  tabType: ClaimTabType;
  sortType: string;
  searchDate: SearchDate;
}
const ClaimDetailTable: FC<IClaimDetailTable> = ({ tableRef, tabType, sortType, searchDate }) => {
  const { user } = useUserInfo();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
    ...(tabType === CLAIM_TAB_TYPE.ALL ? { search_type: sortType } : undefined),
  };

  // Query
  const claimDetailListRes = useCalculateClaimDetailList({ params, tabType });
  useHandlePageDataCnt(claimDetailListRes);

  return (
    <React.Fragment>
      <TableTotalInfo
        fromDate={searchDate.fromDate}
        toDate={searchDate.toDate}
        queryRes={claimDetailListRes}
        initialDetailTotalInfo={CLAIM_DETAIL_TOTAL_INFO[tabType]}
        sumFn={sumClaimDetailTotalInfo}
      />
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={CLAIM_DETAIL_TABLE_COLGROUP_INFO[tabType]} />
        <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={CLAIM_DETAIL_TABLE_THEAD_INFO[tabType]} />
        <Table.TableList
          queryRes={claimDetailListRes}
          render={(datas) =>
            datas?.map((claimData, index) => (
              <tr key={index} style={{ display: checkCurrentPageData(index) ? '' : 'none' }}>
                <td className="align-center">{claimData.send_date.replace(' ', '\n')}</td>
                <td className="align-center">{claimData.use_date.replace(' ', '\n')}</td>
                <td className="align-center">{claimData.use_flag}</td>
                <td className="align-center">{claimData.coupon_title}</td>
                <td className="align-right">{Utils.numberComma(claimData.coupon_amt)}</td>
                <td className="align-center">{claimData.expiration_date.replace(' ', '\n')}</td>
                <td className="align-center">{claimData.send_phone}</td>
                {tabType === CLAIM_TAB_TYPE.ALL && <td className="align-left">{claimData.claim_text}</td>}
                <td className="align-center">{claimData.send_f_name}</td>
                <td className="align-center">{claimData.use_f_name}</td>
                <td className="align-center">{claimData.use_phone}</td>
                <td className="align-right">{Utils.numberComma(claimData.coupon_charge)}</td>
                <td className="align-right">{Utils.numberComma(claimData.supply_amt)}</td>
                <td className="align-right">{Utils.numberComma(claimData.vat_amt)}</td>
                <td className="align-right">{Utils.numberComma(claimData.coupon_charge)}</td>
              </tr>
            ))
          }
        />
      </Table>
    </React.Fragment>
  );
};

export default ClaimDetailTable;
