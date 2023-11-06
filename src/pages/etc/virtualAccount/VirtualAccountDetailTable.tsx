import React, { FC, useLayoutEffect } from 'react';
import Utils from 'utils/Utils';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { VirtualAccListType } from 'types/etc/etcType';

// hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';

// service
import ETC_SERVICE from 'service/etcService';

interface VirtualAccountDetailTableProps {
  searchDate: SearchDate;
  setDetailTotalInfo: React.Dispatch<React.SetStateAction<VirtualAccListType[]>>;
}
const VirtualAccountDetailTable: FC<VirtualAccountDetailTableProps> = ({
  searchDate: { fromDate, toDate },
  setDetailTotalInfo,
}) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();
  const listData = ETC_SERVICE.useEtcList<VirtualAccListType[]>(
    'CS4QOSEGOQGJ8QCALM7L',
    ['etc_virtual_acc_detail_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
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
        datas?.map(({ balance, deposit, division, log_date, etc, state }, index) => {
          const display = checkCurrentPageData(index) ? '' : 'none';

          return (
            <tr key={index} style={{ display }}>
              <td className="align-center">{log_date}</td>
              <td className={`align-center ${division === '차감' ? `negative-value` : ''}`}>{division}</td>
              <td className={`align-center ${division === '차감' ? `negative-value` : ''}`}>
                {Utils.numberComma(deposit)}
              </td>
              <td className="align-center">{state}</td>
              <td className="balance">{Utils.numberComma(balance)}</td>
              <td className="align-left">{etc}</td>
            </tr>
          );
        })
      }
    />
  );
};

export default VirtualAccountDetailTable;
