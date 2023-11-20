import { FC } from 'react';

// component
import Table from 'pages/common/table';

// type
import { RewardEditDataProps, RankListType } from 'types/membership/monthRankType';

// service
import MEMBERSHIP_SERVICE from 'service/membershipService';

// hook
import useModal from 'hooks/common/useModal';
import useReward from 'hooks/membership/useReward';

const PrizeEdit: FC<{ monthRankList: RankListType }> = ({ monthRankList: { fran_name, ...restMonthRank } }) => {
  const { openModal, popModal } = useModal();
  const { rewardValue, editList, handleRewardValue } = useReward(restMonthRank);
  const mutate = MEMBERSHIP_SERVICE.useRankEditList(editList);

  // 저장버튼 클릭
  const handleEditSave = async () => {
    try {
      await mutate();

      popModal();
      openModal({
        type: 'ALERT',
        component: <>수정 완료되었습니다.</>,
      });
    } catch (err) {
      popModal();
      openModal({
        type: 'ALERT',
        component: <>문제가 발생했습니다.</>,
      });
    }
  };

  return (
    <div className="alert-layer setting-layer active">
      <div className="msg-wrap">
        <p className="title">{fran_name} 보상등록</p>
        <Table className="board-wrap" cellPadding="0" cellSpacing="0">
          <Table.ColGroup colGroupAttributes={[{ width: '61' }, { width: '91' }, { width: '272' }, { width: '215' }]} />
          <tbody>
            {Object.values(rewardValue).map((el, idx) => (
              <PrizeEditData key={idx} idx={idx} value={el} handleRewardValue={handleRewardValue} />
            ))}
          </tbody>
        </Table>
        <button type="button" className="btn-close setting-close" onClick={() => popModal()} />
        <button type="button" className="close-btn" style={{ marginRight: '5px' }} onClick={() => popModal()}>
          닫기
        </button>
        <button type="button" className="cta-btn" onClick={handleEditSave}>
          저장
        </button>
      </div>
    </div>
  );
};

export default PrizeEdit;

const PrizeEditData: FC<RewardEditDataProps> = ({ idx, value: { none, point, coupon }, handleRewardValue }) => {
  return (
    <tr>
      <td className="rank">{idx + 1}위</td>
      <td>
        <div className="contents none">
          <input
            className="radio"
            type="radio"
            name={`rank_reward_${idx + 1}-none`}
            value={none ? 'checked' : 'notChecked'}
            id={`none${idx}`}
            checked={none === 'checked' ? true : false}
            onChange={(e) => handleRewardValue(e)}
          />
          <label htmlFor={`none${idx}`}>없음</label>
        </div>
      </td>
      <td>
        <div className="contents point">
          <div>
            <input
              className="radio"
              type="radio"
              name={`rank_reward_${idx + 1}-point`}
              value={1}
              id={`point${idx}`}
              checked={!!point}
              onChange={(e) => handleRewardValue(e)}
              readOnly
            />
            <label htmlFor={`point${idx}`}>바나포인트</label>
          </div>
          <div>
            <input
              type="text"
              value={point}
              name={`rank_reward_${idx + 1}-point`}
              id={`point0${idx}`}
              onChange={(e) => handleRewardValue(e)}
            />
            <span>점</span>
          </div>
        </div>
      </td>
      <td>
        <div className="contents coupon">
          <div>
            <input
              className="radio"
              type="radio"
              name={`rank_reward_${idx + 1}-coupon`}
              value={1}
              id={`coupon${idx}`}
              checked={!!coupon}
              onChange={(e) => handleRewardValue(e)}
              readOnly
            />
            <label htmlFor={`coupon${idx}`}>음료무료쿠폰</label>
          </div>
          <div>
            <input
              type="text"
              value={coupon}
              id={`coupon0${idx}`}
              name={`rank_reward_${idx + 1}-coupon`}
              onChange={(e) => handleRewardValue(e)}
            />
            <span>장</span>
          </div>
        </div>
      </td>
    </tr>
  );
};
