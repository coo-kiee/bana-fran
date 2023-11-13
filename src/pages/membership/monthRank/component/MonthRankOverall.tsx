import React, { FC, useCallback } from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

// comopnent
import Loading from 'pages/common/loading';
import Table from 'pages/common/table';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

// state
import { franState } from 'state';

// type
import { RankInfoItemType, MonthRankOverallProps } from 'types/membership/monthRankType';

// service
import MEMBERSHIP_SERVICE from 'service/membershipService';

const MonthRankOverall: FC<MonthRankOverallProps> = ({ setPopupRankReward }) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
      <Table.ColGroup colGroupAttributes={EXTRA_MONTHRANK_OVERALL_LIST.colgroup} />
      <Table.TableHead thData={EXTRA_MONTHRANK_OVERALL_LIST.thead} />
      <tbody>
        <React.Suspense fallback={<Loading width={50} height={50} isTable={true} />}>
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
            )}
          >
            <MonthRankOverallData setPopupRankReward={setPopupRankReward} />
          </ErrorBoundary>
        </React.Suspense>
      </tbody>
    </Table>
  );
};

const MonthRankOverallData: FC<{ setPopupRankReward: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setPopupRankReward,
}) => {
  const franCode = useRecoilValue(franState);

  let rewards: RankInfoItemType = {
    fran_name: '',
    rank_reward_1: '',
    rank_reward_2: '',
    rank_reward_3: '',
    rank_reward_4: '',
    rank_reward_5: '',
  };
  const rankInfoParams: { fran_store: number } = { fran_store: franCode };
  const { data, isSuccess } = MEMBERSHIP_SERVICE.useRankInfo(rankInfoParams);
  if (isSuccess) {
    rewards = { ...rewards, ...data };
  }

  const handleRankInfoText = (rankInfo: string) => {
    // rankInfo = '음료무료쿠폰 (1장)' | '없음' | '바나포인트 (20,000점)'
    if (rankInfo === '없음') return rankInfo;
    else {
      const [reward, quantity] = rankInfo.split(' ');
      return (
        <>
          {reward}
          <p>{quantity}</p>
        </>
      );
    }
  };

  const handlePopupRankReward = useCallback(() => {
    if (data === undefined) {
      alert('설정이 불가능합니다.');
    } else {
      setPopupRankReward((prev) => true);
    }
  }, [data, setPopupRankReward]);

  return (
    <tr>
      <td>{rewards.fran_name}</td>
      <td>{handleRankInfoText(rewards.rank_reward_1)}</td>
      <td>{handleRankInfoText(rewards.rank_reward_2)}</td>
      <td>{handleRankInfoText(rewards.rank_reward_3)}</td>
      <td>{handleRankInfoText(rewards.rank_reward_4)}</td>
      <td>{handleRankInfoText(rewards.rank_reward_5)}</td>
      <td className="setting-view" onClick={() => handlePopupRankReward()}>
        설정하기
      </td>
    </tr>
  );
};

export default MonthRankOverall;

const EXTRA_MONTHRANK_OVERALL_LIST = {
  colgroup: [
    { width: '232' },
    { width: '232' },
    { width: '232' },
    { width: '232' },
    { width: '232' },
    { width: '232' },
    { width: '232' },
  ],
  thead: [
    [
      { children: '매장' },
      { children: '1위' },
      { children: '2위' },
      { children: '3위' },
      { children: '4위' },
      { children: '5위' },
      { children: '설정' },
    ],
  ],
};
