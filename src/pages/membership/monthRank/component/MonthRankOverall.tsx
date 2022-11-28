import React, { FC } from "react";
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

// comopnent 
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

// state
import { franState } from 'state';

// type
import { EtcTotalParams } from 'types/etc/etcType';
import { RankInfoItemType, MonthRankOverallProps } from 'types/membership/monthRankType';

// service
import MEMBERSHIP_SERVICE from 'service/membershipService';

const MonthRankOverall: FC<MonthRankOverallProps> = ({ tableColGroup, tableHead, setPopupRankReward }) => {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
            <colgroup>
                {tableColGroup.map((el, idx) => <col key={`month_rank_colgroup_item_${idx}`} width={el} />)}
            </colgroup>
            <thead>
                <tr>
                    {tableHead.map((el, idx) => <th key={`month_rank_table_head_item_${idx}`}>{el}</th>)}
                </tr>
            </thead>
            <tbody>
                <React.Suspense fallback={<Loading width={50} height={50} isTable={true} />}>
                    <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />}>
                        <MonthRankOverallData setPopupRankReward={setPopupRankReward} />
                    </ErrorBoundary>
                </React.Suspense>
            </tbody>
        </table>
    )
}

const MonthRankOverallData: FC<{ setPopupRankReward: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setPopupRankReward }) => {
    const franCode = useRecoilValue(franState);
    // 프로시저
    let rewards: RankInfoItemType = {
        fran_name: '',
        rank_reward_1: '',
        rank_reward_2: '',
        rank_reward_3: '',
        rank_reward_4: '',
        rank_reward_5: '',
    }
    const rankInfoParams: EtcTotalParams = { fran_store: franCode };
    const { data, isSuccess } = MEMBERSHIP_SERVICE.useRankInfo(rankInfoParams);
    if (isSuccess) {
        rewards = { ...rewards, ...data };
    };

    const handleRankInfoText = (rankInfo: string) => {// rankInfo = '음료무료쿠폰 (1장)' | '없음' | '바나포인트 (20,000점)'
        // TODO: 보상으로 포인트 들어오는 경우 확인 필요
        if (rankInfo === '없음') return rankInfo;
        else {
            const [reward, quantity] = rankInfo.split(' '); // ' ' 기준으로 나눠주기
            return <>{reward}<p>{quantity}</p></>
        };
    };

    return (
        <tr>
            <td>{rewards.fran_name}</td>
            <td>{handleRankInfoText(rewards.rank_reward_1)}</td>
            <td>{handleRankInfoText(rewards.rank_reward_2)}</td>
            <td>{handleRankInfoText(rewards.rank_reward_3)}</td>
            <td>{handleRankInfoText(rewards.rank_reward_4)}</td>
            <td>{handleRankInfoText(rewards.rank_reward_5)}</td>
            <td className="setting-view" onClick={() => setPopupRankReward((prev) => true)}>설정하기</td>
        </tr>
    )
}

export default MonthRankOverall;
