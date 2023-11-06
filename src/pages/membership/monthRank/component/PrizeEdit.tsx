import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { useQueryClient } from 'react-query';

// state
import { franState } from 'state';

// type
import { RewardEditDataProps } from 'types/membership/monthRankType';

// service
import MEMBERSHIP_SERVICE from 'service/membershipService';

// hook
import useMembershipReward from 'hooks/membership/useMembershipReward';
import useBodyScrollFix from 'hooks/useBodyScrollFix';

const PrizeEdit: FC<{ setPopupRankReward: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setPopupRankReward,
}) => {
  const franCode = useRecoilValue(franState);
  const queryClient = useQueryClient();
  const colGroup = [{ width: '61' }, { width: '91' }, { width: '272' }, { width: '215' }];
  const data: any = queryClient.getQueryData(['membership_rank_info', franCode]); // RankListItemType[] ... 현재 세팅되어 있는 보상등록정보 가져옴
  const { rewardValue, editList, handleRewardValue } = useMembershipReward(data);
  const mutate = MEMBERSHIP_SERVICE.useRankEditList(editList);

  // 저장버튼 클릭
  const handleEditSave = async () => {
    await mutate();
    setPopupRankReward(false);
  };
  useBodyScrollFix();

  return (
    <div className="alert-layer setting-layer active" style={{ position: 'fixed' }}>
      <div className="msg-wrap">
        <p className="title">{data.fran_name} 보상등록</p>
        <table className="board-wrap" cellPadding="0" cellSpacing="0">
          <colgroup>
            {colGroup.map((col, idx) => (
              <col key={idx} {...col} />
            ))}
          </colgroup>
          <tbody>
            {Object.values(rewardValue).map((el, idx) => (
              <PrizeEditData
                key={`month_rank_edit_row_${idx}`}
                idx={idx}
                value={el}
                handleRewardValue={handleRewardValue}
              />
            ))}
          </tbody>
        </table>
        <button type="button" className="btn-close setting-close" onClick={() => setPopupRankReward((prev) => false)} />
        <button
          type="button"
          className="close-btn"
          style={{ marginRight: '5px' }}
          onClick={() => setPopupRankReward((prev) => false)}
        >
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
            name={`reward${idx + 1}_none`}
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
              name={`reward${idx + 1}_point`}
              value={1}
              id={`point${idx}`}
              checked={!!point}
              onChange={(e) => handleRewardValue(e)}
              readOnly
            />
            <label htmlFor={`point${idx}`}>바나포인트</label>
          </div>
          <div>
            <input type="text" value={point} name={`reward${idx + 1}_point`} onChange={(e) => handleRewardValue(e)} />
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
              name={`reward${idx + 1}_coupon`}
              value={1}
              id={`coupon${idx}`}
              checked={!!coupon}
              onChange={(e) => handleRewardValue(e)}
              readOnly
            />
            <label htmlFor={`coupon${idx}`}>음료무료쿠폰</label>
          </div>
          <div>
            <input type="text" value={coupon} name={`reward${idx + 1}_coupon`} onChange={(e) => handleRewardValue(e)} />
            <span>장</span>
          </div>
        </div>
      </td>
    </tr>
  );
};
