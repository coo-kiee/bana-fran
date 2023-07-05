import { useState } from 'react';

// component
import PrizeEdit from './component/PrizeEdit';
import MonthRankOverall from './component/MonthRankOverall';
import MonthRankDetail from './component/MonthRankDetail';

const MonthRankContainer = () => {
    // TODO: 상태 관련 
    const [popupRankReward, setPopupRankReward] = useState<boolean>(false); // EtcOrderDetail 열림 여부

    // TODO: EtcTable 관련 데이터 
    const colGroup = ['232', '232', '232', '232', '232', '232', '232',];
    const thead = ['매장', '1위', '2위', '3위', '4위', '5위', '설정'];

    // TODO: EtcDetailTable 관련 데이터     
    const detailTableColGroup = ['325', '325', '325', '325', '325'];
    const detailTableHead = [
        [{ itemName: '기준일' }, { itemName: '매장' }, { itemName: '당월 랭킹' }, { itemName: '지급 대상자' }, { itemName: '지급 경품' }]
    ];
    return (
        <>
            <section className="container min-width-1200">
                <header>
                    <div className="page-title membership">
                        <p className="present">멤버십현황</p>
                        <p className="spot">월간 랭킹 현황</p>
                    </div>
                </header>
                <section className="contents-wrap membership_ranking">
                    <div className="contents">
                        <div className="info-wrap">
                            <p>※ 매장의 월간 랭킹 보상 지급 설정 및 현황을 조회할 수 있습니다.</p>
                        </div>
                        <div className="board-date-wrap">
                            <p className="title bullet">랭킹 보상 설정
                                <span className="sub-title hyphen">월간랭킹 1~5위 고객에 대한 보상(바나포인트/무료음료쿠폰)을 등록할 수 있습니다.</span>
                                <span className="sub-title hyphen">설정된 보상은 익월 1일에 자동 지급됩니다.</span>
                                <span className="sub-title hyphen">월강랭킹보상 무료음료쿠폰은 최대금액 제한없이 모든 음료가 구매가능한 쿠폰입니다.</span>
                            </p>
                            <MonthRankOverall tableColGroup={colGroup} tableHead={thead} setPopupRankReward={setPopupRankReward} />
                            <MonthRankDetail detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                        </div>
                    </div>
                </section>
            </section>
            {popupRankReward && <PrizeEdit setPopupRankReward={setPopupRankReward} />}
        </>
    )
}

export default MonthRankContainer;