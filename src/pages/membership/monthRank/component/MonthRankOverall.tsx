import React from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Utils from 'utils/Utils';

// component
import Loading from 'pages/common/loading';
import Table from 'pages/common/table';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import PrizeEdit from './PrizeEdit';

// hook
import useUserInfo from 'hooks/user/useUser';
import useModal from 'hooks/common/useModal';
import useRewardProps from 'hooks/membership/useRewardProps';

// type
import { IModalParams } from 'state/modal';

// service
import MEMBERSHIP_SERVICE from 'service/membershipService';

const MonthRankOverall = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
      <Table.ColGroup colGroupAttributes={EXTRA_MONTHRANK_OVERALL_LIST.colgroup} />
      <Table.TableHead thData={EXTRA_MONTHRANK_OVERALL_LIST.thead} />
      <tbody>
        <React.Suspense fallback={<Loading width={50} height={50} marginTop={0} isTable={true} />}>
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
            )}
          >
            <MonthRankOverallData />
          </ErrorBoundary>
        </React.Suspense>
      </tbody>
    </Table>
  );
};

const MonthRankOverallData = () => {
  const {
    user: { fCode },
  } = useUserInfo();
  const { openModal } = useModal();

  const { data } = MEMBERSHIP_SERVICE.useRankInfo({ fran_store: fCode });
  const { monthRankList } = useRewardProps(data);

  const handleRankInfoText = (value: string) => {
    if (value.includes('포인트')) {
      return (
        <>
          바나포인트<p>({Utils.numberComma(Number(value.replace(/[^0-9]/g, '')))}점)</p>
        </>
      );
    } else if (value.includes('쿠폰')) {
      return (
        <>
          음료무료쿠폰<p>({Utils.numberComma(Number(value.replace(/[^0-9]/g, '')))}점)</p>
        </>
      );
    } else return <>없음</>;
  };

  const handleOpenPrizeModal = () => {
    let modalParams = {} as IModalParams;

    switch (true) {
      case !!data:
        modalParams = {
          type: 'CUSTOM',
          component: <PrizeEdit monthRankList={monthRankList} />,
        };
        break;
      case !data:
        modalParams = {
          type: 'ALERT',
          component: <>설정이 불가능합니다.</>,
        };
        break;
      default:
        return;
    }

    openModal(modalParams);
  };

  return (
    <tr>
      <td>{data?.fran_name ? data.fran_name : '-'}</td>
      <td>{data && data.rank_reward_1 ? handleRankInfoText(data.rank_reward_1) : ' '}</td>
      <td>{data && data.rank_reward_2 ? handleRankInfoText(data.rank_reward_2) : ' '}</td>
      <td>{data && data.rank_reward_3 ? handleRankInfoText(data.rank_reward_3) : ' '}</td>
      <td>{data && data.rank_reward_4 ? handleRankInfoText(data.rank_reward_4) : ' '}</td>
      <td>{data && data.rank_reward_5 ? handleRankInfoText(data.rank_reward_5) : ' '}</td>
      <td className="setting-view" onClick={() => handleOpenPrizeModal()}>
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
