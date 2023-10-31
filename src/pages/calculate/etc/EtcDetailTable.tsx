import { RefObject } from 'react';

// Const
import { SearchDate } from 'constants/calculate/common';
import {
  EtcDetailFilterOption,
  ETC_DETAIL_TOTAL_INFO,
  ETC_DETAIL_COLGROUP_INFO,
  ETC_DETAIL_THEAD_INFO,
  ETC_CHARGE_MULTIPLY,
} from 'constants/calculate/etc';

// Hook
import useEtcFilterCondition from 'hooks/calculate/etc/useEtcFilterCondition';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// API
import { useCalculateEtcDetailList } from 'service/calculateService';

// Util
import Utils from 'utils/Utils';
import { sumEtcDetailTotalInfo } from 'utils/calculate/sumEtcDetailTotalInfo';

// Component
import Table from 'pages/common/table';
import CalculateDetailTotalInfo from '../component/CalculateDetailTotalInfo';

interface IEtcDetailTable {
  tableRef: RefObject<HTMLTableElement>;
  searchDate: SearchDate;
  filterCondition: Record<keyof EtcDetailFilterOption, string>;
}
const EtcDetailTable = ({ tableRef, searchDate, filterCondition }: IEtcDetailTable) => {
  const { user } = useUserInfo();
  const { filterData } = useEtcFilterCondition();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
  };

  // Query
  const etcDetailListRes = useCalculateEtcDetailList(params);
  useHandlePageDataCnt(etcDetailListRes, filterCondition, filterData);

  return (
    <>
      <CalculateDetailTotalInfo
        searchDate={searchDate}
        queryRes={etcDetailListRes}
        initialDetailTotalInfo={ETC_DETAIL_TOTAL_INFO}
        sumFn={sumEtcDetailTotalInfo}
      />
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={ETC_DETAIL_COLGROUP_INFO} />
        <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={ETC_DETAIL_THEAD_INFO} />
        <Table.TableList
          queryRes={etcDetailListRes}
          render={(datas) =>
            datas
              ?.filter((etcDetail) => filterData(filterCondition, etcDetail))
              .map((etcDetail, index) => {
                const display = checkCurrentPageData(index) ? '' : 'none';

                return (
                  <tr key={index} style={{ display }}>
                    <td className="align-center">{etcDetail.std_month}</td>
                    <td className="align-center">{etcDetail.calculate_type}</td>
                    <td className="align-left">{etcDetail.item_detail}</td>
                    <td className="align-right">
                      {Utils.numberComma(etcDetail.supply_amt * ETC_CHARGE_MULTIPLY[etcDetail.calculate_type])}
                    </td>
                    <td className="align-right">
                      {Utils.numberComma(etcDetail.vat_amt * ETC_CHARGE_MULTIPLY[etcDetail.calculate_type])}
                    </td>
                    <td className="align-right">
                      <strong>
                        {Utils.numberComma(etcDetail.total_amt * ETC_CHARGE_MULTIPLY[etcDetail.calculate_type])}
                      </strong>
                    </td>
                  </tr>
                );
              })
          }
        />
      </Table>
    </>
  );
};

export default EtcDetailTable;
