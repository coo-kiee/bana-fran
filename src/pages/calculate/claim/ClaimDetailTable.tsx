import { FC, useRef } from 'react';

// Type
import { CALCULATE_TITLE, CALCULATE_TYPE, SearchDate } from 'constants/calculate/common';
import {
  ClaimTabType,
  CLAIM_DETAIL_TABLE_COLGROUP_INFO,
  CLAIM_DETAIL_TABLE_THEAD_INFO,
  CLAIM_DETAIL_TOTAL_INFO,
  CLAIM_TAB_TYPE,
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
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';

interface IClaimDetailTable {
  tabType: ClaimTabType;
  sortType: string;
  searchDate: SearchDate;
}
const ClaimDetailTable: FC<IClaimDetailTable> = ({ tabType, sortType, searchDate }) => {
  const tableRef = useRef<HTMLTableElement>(null);

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
    <>
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
      <div className="result-function-wrap">
        <ExcelButton
          type={'table'}
          target={tableRef}
          tableRef={tableRef}
          fileName={`${user.fCodeName}_${CALCULATE_TITLE[CALCULATE_TYPE.CLAIM]}(${searchDate.fromDate}~${
            searchDate.toDate
          })`}
          sheetOption={{ origin: 'B3' }}
          colWidths={Object.values(CLAIM_DETAIL_TABLE_COLGROUP_INFO[tabType]).flatMap((item) =>
            item.width !== '*' ? { wpx: Number(item.width) * 1.2 } : { wpx: 400 },
          )}
          addRowColor={{ rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }}
        />
        <Pages />
      </div>
    </>
  );
};

export default ClaimDetailTable;
