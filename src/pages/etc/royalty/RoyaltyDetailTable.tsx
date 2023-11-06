import React, { FC, useLayoutEffect } from 'react';
import Utils from 'utils/Utils';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { RoyaltyDetailListType } from 'types/etc/etcType';

// hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';

// service
import ETC_SERVICE from 'service/etcService';

interface RoyaltyDetailTableProps {
  searchDate: SearchDate;
  setDetailTotalInfo: React.Dispatch<React.SetStateAction<RoyaltyDetailListType[]>>;
}
const RoyaltyDetailTable: FC<RoyaltyDetailTableProps> = ({ searchDate: { fromDate, toDate }, setDetailTotalInfo }) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();
  const listData = ETC_SERVICE.useEtcList<RoyaltyDetailListType[]>(
    'YGQA4CREHNZCZIXPF2AH',
    ['etc_royalty_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );

  useHandlePageDataCnt(listData);
  useLayoutEffect(() => {
    if (!listData?.data) return;

    setDetailTotalInfo(listData.data);
  }, [listData, setDetailTotalInfo]);

  return (
    <Table.TableList
      queryRes={listData}
      render={(datas) =>
        datas?.map(({ std_date, state, suply_amount, tax_amount, total_amount }, index) => {
          const display = checkCurrentPageData(index) ? '' : 'none';

          return (
            <tr key={index} style={{ display }}>
              <td className="align-center">{std_date}</td>
              <td className="align-left">{state}</td>
              <td className="align-right">{Utils.numberComma(suply_amount)}</td>
              <td className="align-right">{Utils.numberComma(tax_amount)}</td>
              <td className="align-right">{Utils.numberComma(total_amount)}</td>
            </tr>
          );
        })
      }
    />
  );
};

export default RoyaltyDetailTable;
