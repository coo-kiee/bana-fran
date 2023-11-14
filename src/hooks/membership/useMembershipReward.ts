import { useState, useEffect, ChangeEventHandler } from 'react';
import { useRecoilValue } from 'recoil';

// hook
import useUserInfo from 'hooks/user/useUser';

// state
import { loginState } from 'state';

// type
import { RewardEditItemType } from 'types/membership/monthRankType';

const useMembershipReward = (data: any) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const {
    userInfo: { staff_name },
  } = useRecoilValue(loginState);
  const defaultValue = { none: 'checked', coupon: 0, point: 0 };
  const [rewardValue, setRewardValue] = useState<{ [key: string]: RewardEditItemType }>({
    reward1: { ...defaultValue },
    reward2: { ...defaultValue },
    reward3: { ...defaultValue },
    reward4: { ...defaultValue },
    reward5: { ...defaultValue },
  });

  useEffect(() => {
    const handleRewardInfo = (reward: string) => {
      let tempRewardInfo: RewardEditItemType = { none: 'checked', coupon: 0, point: 0 };

      if (reward.includes('쿠폰')) {
        tempRewardInfo = { ...tempRewardInfo, none: 'notChecked', coupon: Number(reward.replace(/[^0-9]/g, '')) };
      } else if (reward.includes('포인트')) {
        tempRewardInfo = { ...tempRewardInfo, none: 'notChecked', point: Number(reward.replace(/[^0-9]/g, '')) };
      }

      return tempRewardInfo;
    };

    setRewardValue({
      reward1: handleRewardInfo(data.rank_reward_1),
      reward2: handleRewardInfo(data.rank_reward_2),
      reward3: handleRewardInfo(data.rank_reward_3),
      reward4: handleRewardInfo(data.rank_reward_4),
      reward5: handleRewardInfo(data.rank_reward_5),
    });
  }, [data]);

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

  const handleRewardValue: ChangeEventHandler<HTMLInputElement> = ({ target: { name, value } }) => {
    const [key1Name, key2Name] = name.split('_');

    if (value === '' || value === '0') {
      setRewardValue((prev) => ({ ...prev, [key1Name]: { none: 'checked', coupon: 0, point: 0 } }));
    } else if ((key2Name === 'coupon' || key2Name === 'point') && isNaN(Number(value))) {
      alert('숫자만 입력해주세요.'); // 숫자가 아닌 문자 넣은 경우 alert
    } else {
      setRewardValue((prev) => ({
        ...prev,
        [key1Name]: {
          none: 'notChecked',
          coupon: 0,
          point: 0,
          [key2Name]: key2Name !== 'none' ? Number(value) : value,
        },
      }));
    }
  };
  return { rewardValue, editList, handleRewardValue };
};

export default useMembershipReward;
