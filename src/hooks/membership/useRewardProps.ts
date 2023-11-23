import { useMemo } from 'react';

// type
import { RankInfoItemType, defaultRewardEditItem } from 'types/membership/monthRankType';

const useRewardProps = (data: RankInfoItemType | undefined) => {
  const monthRankList = useMemo(() => {
    const handleRewardValue = (value: string) => {
      if (value.includes('포인트')) {
        return { ...defaultRewardEditItem, none: 'notChecked', point: Number(value.replace(/[^0-9]/g, '')) };
      } else if (value.includes('쿠폰')) {
        return { ...defaultRewardEditItem, none: 'notChecked', coupon: Number(value.replace(/[^0-9]/g, '')) };
      } else return defaultRewardEditItem;
    };

    return data
      ? {
          fran_name: data.fran_name,
          rank_reward_1: handleRewardValue(data.rank_reward_1),
          rank_reward_2: handleRewardValue(data.rank_reward_2),
          rank_reward_3: handleRewardValue(data.rank_reward_3),
          rank_reward_4: handleRewardValue(data.rank_reward_4),
          rank_reward_5: handleRewardValue(data.rank_reward_5),
        }
      : {
          fran_name: '-',
          rank_reward_1: defaultRewardEditItem,
          rank_reward_2: defaultRewardEditItem,
          rank_reward_3: defaultRewardEditItem,
          rank_reward_4: defaultRewardEditItem,
          rank_reward_5: defaultRewardEditItem,
        };
  }, [data]);

  return { monthRankList };
};

export default useRewardProps;
