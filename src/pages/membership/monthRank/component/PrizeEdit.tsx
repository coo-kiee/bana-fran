import React, { useState, FC, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { useQueryClient } from 'react-query'

// state
import { franState, loginState } from 'state'

// type
import { RANK_REWARD_TYPE, RANK_REWARD_LIST, RewardEditItemType, RewardEditDataProps } from 'types/membership/monthRankType'

// service
import MEMBERSHIP_SERVICE from 'service/membershipService'

const PrizeEdit: FC<{ setPopupRankReward: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setPopupRankReward }) => {
    const franCode = useRecoilValue(franState);
    const { userInfo: { staff_name } } = useRecoilValue(loginState);
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

    // TODO: 상태
    const [rewardValue, setRewardValue] = useState<{ [key: string]: RewardEditItemType }>({
        reward1: handleRewardInfo(data.rank_reward_1),
        reward2: handleRewardInfo(data.rank_reward_2),
        reward3: handleRewardInfo(data.rank_reward_3),
        reward4: handleRewardInfo(data.rank_reward_4),
        reward5: handleRewardInfo(data.rank_reward_5),
    }); // 입력값 관련 

    // 상태 관련
    const handleRewardValue = (keyName: string, target: { [key in keyof RewardEditItemType]?: RewardEditItemType[key] }) => {
        const [key, value] = Object.entries(target)[0];
        if ((key === 'coupon' || key === 'point') && isNaN(Number(value))) {
            alert('숫자만 입력해주세요.'); // 숫자가 아닌 문자 넣은 경우 alert
        } else {
            // 업데이트
            setRewardValue((prev) => {
                return { ...prev, [keyName]: { none: 'notChecked', coupon: 0, point: 0, ...target } };
            });
        }
    };

    // TODO: 1위 ~ 5위 관련 tr 관련
    const rankEditList = {
        [RANK_REWARD_TYPE.RANK_REWARD_1]: { title: 'reward1', value: rewardValue.reward1, },
        [RANK_REWARD_TYPE.RANK_REWARD_2]: { title: 'reward2', value: rewardValue.reward2, },
        [RANK_REWARD_TYPE.RANK_REWARD_3]: { title: 'reward3', value: rewardValue.reward3, },
        [RANK_REWARD_TYPE.RANK_REWARD_4]: { title: 'reward4', value: rewardValue.reward4, },
        [RANK_REWARD_TYPE.RANK_REWARD_5]: { title: 'reward5', value: rewardValue.reward5, },
    };

    const editList = useMemo(() => {
        const handlePayment = ({ coupon, point }: RewardEditItemType) => {
            if (coupon > 0) return { type: 'C', amount: coupon };
            else if (point > 0) return { type: 'P', amount: point };
            else return { type: 'N', amount: 0 };
        }; // 보상 타입 지정

        return Object.values(rewardValue).map((reward, idx) => {
            const { type, amount } = handlePayment(reward);
            return { fran_store: franCode, rank_number: idx + 1, payment_type: type, payment: amount, user_name: staff_name, } // reqData 준비
        })
    }, [franCode, staff_name, rewardValue]);
    const mutate = MEMBERSHIP_SERVICE.useRankEditList(editList);

    // 저장버튼 클릭 
    const handleEditSave = async () => {
        await mutate();
        setPopupRankReward(false)
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
                            const { title, value } = rankEditList[type];
                            return <PrizeEditData key={`month_rank_edit_row_${idx}`} idx={idx} title={title} value={value} handleRewardValue={handleRewardValue} />
                        })}
                    </tbody>
                </table>
                <button className="btn-close setting-close" onClick={() => setPopupRankReward((prev) => false)}></button>
                <button className="close-btn" onClick={() => setPopupRankReward((prev) => false)}>닫기</button>
                <button className="cta-btn" onClick={handleEditSave}>저장</button>
            </div>
        </div>
    )
}

export default PrizeEdit;


const PrizeEditData: FC<RewardEditDataProps> = ({ idx, title, value: { none, point, coupon }, handleRewardValue }) => {
    return (
        <tr>
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
}