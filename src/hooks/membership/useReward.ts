import { useState, ChangeEventHandler } from 'react';
import { useRecoilValue } from 'recoil';

// hook
import useUserInfo from 'hooks/user/useUser';

// state
import { loginState } from 'state';

// type
import { RankListType, defaultRewardEditItem } from 'types/membership/monthRankType';

const useReward = (monthRankList: Omit<RankListType, 'fran_name'>) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const {
    userInfo: { staff_name },
  } = useRecoilValue(loginState);
  const [rewardValue, setRewardValue] = useState<Omit<RankListType, 'fran_name'>>({
    rank_reward_1: { ...defaultRewardEditItem, ...monthRankList.rank_reward_1 },
    rank_reward_2: { ...defaultRewardEditItem, ...monthRankList.rank_reward_2 },
    rank_reward_3: { ...defaultRewardEditItem, ...monthRankList.rank_reward_3 },
    rank_reward_4: { ...defaultRewardEditItem, ...monthRankList.rank_reward_4 },
    rank_reward_5: { ...defaultRewardEditItem, ...monthRankList.rank_reward_5 },
  });

  const editList = Object.values(rewardValue).map(({ coupon, point }, idx) => {
    let type = 'N';
    let amount = 0;

    if (coupon > 0) {
      type = 'C';
      amount = coupon;
    } else if (point > 0) {
      type = 'P';
      amount = point;
    } // 보상 타입 지정

    return { fran_store: fCode, rank_number: idx + 1, payment_type: type, payment: amount, user_name: staff_name }; // reqData 준비
  });

  const handleRewardValue: ChangeEventHandler<HTMLInputElement> = ({ target: { name, id, value, checked } }) => {
    const idWithoutIdx = id.replace(/\d/g, '');
    const nameWithoutDash = name.split('-')[0];
    // console.log({ idWithoutIdx, nameWithoutDash, value, checked });

    if (value === '' || value === '0') {
      setRewardValue((prev) => ({ ...prev, [nameWithoutDash]: { none: true, coupon: 0, point: 0 } }));
    } else if ((idWithoutIdx === 'coupon' || idWithoutIdx === 'point') && isNaN(Number(value))) {
      alert('숫자만 입력해주세요.'); // 숫자가 아닌 문자 넣은 경우 alert
    } else {
      setRewardValue((prev) => ({
        ...prev,
        [nameWithoutDash]: {
          ...defaultRewardEditItem,
          none: idWithoutIdx !== 'none' ? false : true,
          [idWithoutIdx]: idWithoutIdx !== 'none' ? Number(value) : checked,
        },
      }));
    }
  };

  return { rewardValue, editList, handleRewardValue };
};

export default useReward;
