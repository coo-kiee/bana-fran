import { SearchInfoType, TableHeadItemType } from "types/etc/etcType";

// type 
interface RankInfoItemType {
    fran_name: string,
    rank_reward_1: string,
    rank_reward_2: string,
    rank_reward_3: string,
    rank_reward_4: string,
    rank_reward_5: string,
}// useRankInfo 결과 값 타입

interface RankListItemType {
    gift: string,
    nRank: number,
    nickname: string,
    sDate: string,
    sName: string,
    sPhone: string,
} // useRankList 결과 값 타입

interface RewardEditItemType {
    none: string,
    coupon: number,
    point: number
}

// param
interface RankEditParams {
    fran_store: number,
    rank_number: number,
    payment_type: string,
    payment: number,
    user_name: string,
}

// props
interface MonthRankOverallProps {
    tableColGroup: string[],
    tableHead: string[],
    setPopupRankReward: React.Dispatch<React.SetStateAction<boolean>>
}

interface MonthRankDetailProps {
    detailTableColGroup: string[],
    detailTableHead: TableHeadItemType[][],
    searchInfo: SearchInfoType,
    rankListKey: string[]
}

interface RewardEditDataProps {
    idx: number,
    title: string,
    value: RewardEditItemType,
    handleRewardValue: (keyName: string, value: { [key in keyof RewardEditItemType]?: RewardEditItemType[key] }) => void;
}

// 보상등록 관련 type
const RANK_REWARD_TYPE = {
    RANK_REWARD_1: 0, // 1위
    RANK_REWARD_2: 1, // 2위
    RANK_REWARD_3: 2, // 3위
    RANK_REWARD_4: 3, // 4위
    RANK_REWARD_5: 4, // 5위
}

const RANK_REWARD_LIST = [
    RANK_REWARD_TYPE.RANK_REWARD_1,
    RANK_REWARD_TYPE.RANK_REWARD_2,
    RANK_REWARD_TYPE.RANK_REWARD_3,
    RANK_REWARD_TYPE.RANK_REWARD_4,
    RANK_REWARD_TYPE.RANK_REWARD_5,
] as const;

export type {
    RewardEditItemType, RankInfoItemType, RankListItemType, RankEditParams, 
    MonthRankOverallProps, MonthRankDetailProps, RewardEditDataProps,
}

export { RANK_REWARD_TYPE, RANK_REWARD_LIST }