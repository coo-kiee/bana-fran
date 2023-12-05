import { ChangeEventHandler } from 'react';

// type
interface RankInfoItemType {
  fran_name: string;
  rank_reward_1: string;
  rank_reward_2: string;
  rank_reward_3: string;
  rank_reward_4: string;
  rank_reward_5: string;
} // useRankInfo 결과 값 타입

interface RankListItemType {
  gift: string;
  nRank: number;
  nickname: string;
  sDate: string;
  sName: string;
  sPhone: string;
} // useRankList 결과 값 타입

type RankListType = Record<keyof Omit<RankInfoItemType, 'fran_name'>, RewardEditItemType> & { fran_name: string };

export const defaultRewardEditItem = { none: true, coupon: 0, point: 0 };
interface RewardEditItemType {
  none: boolean;
  coupon: number;
  point: number;
}

// param
interface RankEditParams {
  fran_store: number;
  rank_number: number;
  payment_type: string;
  payment: number;
  user_name: string;
}

// props
interface RewardEditDataProps {
  idx: number;
  value: RewardEditItemType;
  handleRewardValue: ChangeEventHandler<HTMLInputElement>;
}

export type {
  RankListType,
  RewardEditItemType,
  RankInfoItemType,
  RankListItemType,
  RankEditParams,
  RewardEditDataProps,
};
