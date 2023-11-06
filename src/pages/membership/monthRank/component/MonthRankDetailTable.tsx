import { FC } from 'react';

// type, constant
import { SearchDate } from 'constants/calculate/common';

// hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';

// service
import MEMBERSHIP_SERVICE from 'service/membershipService';

const MonthRankDetailTable: FC<{ searchDate: SearchDate }> = ({ searchDate: { fromDate, toDate } }) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();

  const listData = MEMBERSHIP_SERVICE.useRankList(
    ['membership_rank_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );
  useHandlePageDataCnt(listData);

  return (
    <Table.TableList
      queryRes={listData}
      render={(datas) =>
        datas?.map(({ sDate, sName, nRank, sPhone, nickname, gift }, index) => {
          const [rewardType, rewardAmount] = gift.split(' ');
          const display = checkCurrentPageData(index) ? '' : 'none';

          return (
            <tr key={index} style={{ display }}>
              <td>{sDate}</td>
              <td>{sName}</td>
              <td>{nRank}</td>
              <td>
                {sPhone || '번호 정보 없음'} <span>({nickname || '-'})</span>
              </td>
              <td>
                {rewardType}
                <p>{rewardAmount}</p>
              </td>
            </tr>
          );
        })
      }
    />
  );
};

export default MonthRankDetailTable;
