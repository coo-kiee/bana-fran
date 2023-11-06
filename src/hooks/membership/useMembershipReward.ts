import useUserInfo from 'hooks/user/useUser';
import { useState, useEffect, ChangeEventHandler } from 'react';
import { useRecoilValue } from 'recoil';
import { loginState } from 'state';
import { RewardEditItemType } from 'types/membership/monthRankType';

const useMembershipReward = (data: any) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const {
    userInfo: { staff_name },
  } = useRecoilValue(loginState);
  const defaultValue = { none: 'checked', coupon: 0, point: 0 };
  const handleRewardInfo = (reward: string) => {
    let tempRewardInfo: RewardEditItemType = { none: 'notChecked', coupon: 0, point: 0 };
    if (reward === '없음') {
      // 보상이 없는 경우
      tempRewardInfo = { ...tempRewardInfo, none: 'checked' };
    } else {
      // 보상이 있는 경우 텍스트에서 숫자만 뽑아내기
      if (reward.includes('쿠폰')) {
        // 보상이 음료무료쿠폰인 경우
        tempRewardInfo = { ...tempRewardInfo, coupon: Number(reward.replace(/[^0-9]/g, '')) };
      } else {
        // 보상이 바나포인트인 경우
        tempRewardInfo = { ...tempRewardInfo, point: Number(reward.replace(/[^0-9]/g, '')) };
      }
    }
    return tempRewardInfo;
  };
  const [rewardValue, setRewardValue] = useState<{ [key: string]: RewardEditItemType }>({
    reward1: { ...defaultValue },
    reward2: { ...defaultValue },
    reward3: { ...defaultValue },
    reward4: { ...defaultValue },
    reward5: { ...defaultValue },
  });

  const handlePayment = ({ coupon, point }: RewardEditItemType) => {
    if (coupon > 0) return { type: 'C', amount: coupon };
    else if (point > 0) return { type: 'P', amount: point };
    else return { type: 'N', amount: 0 };
  }; // 보상 타입 지정

  useEffect(() => {
    setRewardValue({
      reward1: handleRewardInfo(data.rank_reward_1),
      reward2: handleRewardInfo(data.rank_reward_2),
      reward3: handleRewardInfo(data.rank_reward_3),
      reward4: handleRewardInfo(data.rank_reward_4),
      reward5: handleRewardInfo(data.rank_reward_5),
    });
  }, [data]);

  const editList = Object.values(rewardValue).map((reward, idx) => {
    const { type, amount } = handlePayment(reward);
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
