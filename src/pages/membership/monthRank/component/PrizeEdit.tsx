import { useState, FC } from 'react'
import { useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'

// state
import { franState } from 'state'

// type
import { RANK_REWARD_TYPE, RANK_REWARD_LIST, RewardEditItemType } from 'types/membership/monthRankType'
interface PrizeEditProps {
    setPopupRankReward: React.Dispatch<React.SetStateAction<boolean>>
}

const PrizeEdit: FC<PrizeEditProps> = ({ setPopupRankReward }) => {
    const franCode = useRecoilValue(franState);
    const queryClient = useQueryClient();
    const colGroup = ['61', '91', '272', '215'];
    const data: any = queryClient.getQueryData(['membership_rank_info', franCode]); // 현재 세팅되어 있는 보상등록정보 가져옴

    // TODO: 텍스트로 구분해주기
    const handleRewardInfo = (reward: string) => {
        let tempRewardInfo: RewardEditItemType = { none: 'notChecked', coupon: 0, point: 0 };
        if (reward === '없음') {
            // 보상이 없는 경우
            tempRewardInfo = { ...tempRewardInfo, none: 'checked' }
        } else {
            // 보상이 있는 경우 텍스트에서 숫자만 뽑아내기
            if (reward.includes('쿠폰')) {
                // 보상이 음료무료쿠폰인 경우
                tempRewardInfo = { ...tempRewardInfo, coupon: Number(reward.replace(/[^0-9]/g, '')) }
            } else {
                // 보상이 바나포인트인 경우
                tempRewardInfo = { ...tempRewardInfo, point: Number(reward.replace(/[^0-9]/g, '')) }
            }
        };
        return tempRewardInfo;
    };
    const [rewardValue, setRewardValue] = useState<{ [key: string]: RewardEditItemType }>({
        reward1: handleRewardInfo(data.rank_reward_1),
        reward2: handleRewardInfo(data.rank_reward_2),
        reward3: handleRewardInfo(data.rank_reward_3),
        reward4: handleRewardInfo(data.rank_reward_4),
        reward5: handleRewardInfo(data.rank_reward_5),
    });

    // 상태 관련
    const handleRewardValue = (keyName: string, value: { [key in keyof RewardEditItemType]?: RewardEditItemType[key] }) => {
        setRewardValue((prev) => {
            return { ...prev, [keyName]: { none: 'notChecked', coupon: 0, point: 0, ...value } };
        });
    };

    // TODO: 1위 ~ 5위 관련 tr 관련
    const rankEditList = {
        [RANK_REWARD_TYPE.RANK_REWARD_1]: { title: 'reward1', value: rewardValue.reward1, },
        [RANK_REWARD_TYPE.RANK_REWARD_2]: { title: 'reward2', value: rewardValue.reward2, },
        [RANK_REWARD_TYPE.RANK_REWARD_3]: { title: 'reward3', value: rewardValue.reward3, },
        [RANK_REWARD_TYPE.RANK_REWARD_4]: { title: 'reward4', value: rewardValue.reward4, },
        [RANK_REWARD_TYPE.RANK_REWARD_5]: { title: 'reward5', value: rewardValue.reward5, },
    };

    return (
        <div className="alert-layer setting-layer active">
            <div className="msg-wrap">
                <p className="title">{data.fran_name} 보상등록</p>
                <table className="board-wrap" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        {colGroup.map((col, idx) => <col key={`month_rank_edit_col_${idx}`} width={col} />)}
                    </colgroup>
                    <tbody>
                        {RANK_REWARD_LIST.map((type: number, idx: number) => {
                            const { title, value: { none, point, coupon } } = rankEditList[type];

                            return (
                                <tr key={`month_rank_edit_row_${idx}`}>
                                    <td className="rank">{idx + 1}위</td>
                                    <td>
                                        <div className="contents none" onChange={(e) => handleRewardValue(title, { none: 'checked' })}>
                                            <input className="radio" type="radio" name={`row${idx}`} value={none ? 'checked' : 'notChecked'} id={`none${idx}`} defaultChecked={none === 'checked' ? true : false} onChange={(e) => handleRewardValue(title, { none: none === 'checked' ? 'notChecked' : 'checked' })} />
                                            <label htmlFor={`none${idx}`}>없음</label>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contents point">
                                            <div onChange={(e) => handleRewardValue(title, { point: 1 })}>
                                                <input className="radio" type="radio" name={`row${idx}`} value={point} id={`point${idx}`} defaultChecked={!!point} readOnly />
                                                <label htmlFor={`point${idx}`}>바나포인트</label>
                                            </div>
                                            <div>
                                                <input type="text" value={point} onChange={(e) => handleRewardValue(title, { point: Number(e.target.value) })} />
                                                <span>점</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contents coupon">
                                            <div onChange={(e) => handleRewardValue(title, { coupon: 1 })}>
                                                <input className="radio" type="radio" name={`row${idx}`} value={coupon} id={`coupon${idx}`} defaultChecked={!!coupon} readOnly />
                                                <label htmlFor={`coupon${idx}`}>음료무료쿠폰</label>
                                            </div>
                                            <div>
                                                <input type="text" value={coupon} onChange={(e) => handleRewardValue(title, { coupon: Number(e.target.value) })} />
                                                <span>점</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <button className="btn-close setting-close" onClick={() => setPopupRankReward((prev) => false)}></button>
                <button className="close-btn" onClick={() => setPopupRankReward((prev) => false)}>닫기</button>
                <button className="cta-btn">저장</button>
            </div>
        </div>
    )
}

export default PrizeEdit;