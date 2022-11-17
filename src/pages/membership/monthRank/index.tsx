import { useState } from 'react';
import { format, subMonths } from 'date-fns';

// type 
import { SearchInfoType } from 'types/etc/etcType';

// component
import PrizeEdit from './component/PrizeEdit';
import MonthRankOverall from './component/MonthRankOverall';
import MonthRankDetail from './component/MonthRankDetail';

const MonthRankContainer = () => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoType>({
        from: format(new Date(), 'yyyy-MM-01'),
        to: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    }); // 실제 쿼리에서 사용될 날짜, 옵션값
    const [popupRankReward, setPopupRankReward] = useState<boolean>(false); // EtcOrderDetail 열림 여부

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

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
            <section className="container">
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
                            <MonthRankOverall tableColGroup={colGroup} tableHead={thead} setPopupRankReward={setPopupRankReward} />
                            <MonthRankDetail searchInfo={searchInfo} handleSearchInfo={handleSearchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                        </div>
                    </div>
                </section>
            </section>
            {popupRankReward && <PrizeEdit setPopupRankReward={setPopupRankReward} />}
        </>
    )
}

export default MonthRankContainer;