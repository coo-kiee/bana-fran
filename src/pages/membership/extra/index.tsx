// component
import ExtraOverall from './component/ExtraOverall';
import ExtraDetail from './component/ExtraDetail';

const ExtraContainer = () => {
    // TODO: EtcTable 관련 데이터 (프로시저 데이터 확인 후 수정하기) 
    const thead = [
        [
            { itemName: ['스탬프'], colSpan: 4, className: 'boder-th-a' },
            { itemName: ['무료음료쿠폰 (스탬프적립&월간랭킹보상)'], colSpan: 4, className: 'price-area boder-th-b' },
            { itemName: ['바나포인트 (적립&월간랭킹보상)'], colSpan: 4 }
        ],
        [
            // 스탬프
            { itemName: ['총 지급 수'], className: 'height-63' },
            { itemName: ['총 쿠폰전환 수'], className: 'height-63' },
            { itemName: ['총 유효기간 소멸 수'], className: 'height-63' },
            { itemName: ['쿠폰 미전환 수'], className: 'height-63' },
            // 무료음료쿠폰
            { itemName: ['총 발급 수', '금액'], className: 'price-area height-63' },
            { itemName: ['총 사용 수', '금액'], className: 'price-area height-63' },
            { itemName: ['총 유효기간 소멸 수', '금액'], className: 'price-area height-63' },
            { itemName: ['쿠폰 미전환 수', '금액'], className: 'price-area height-63' },
            // 바나포인트
            { itemName: ['총 적립'], className: 'height-63' },
            { itemName: ['총 사용'], className: 'height-63' },
            { itemName: ['총 유효기간 소멸'], className: 'height-63' },
            { itemName: ['미사용 잔액'], className: 'height-63' },
        ]
    ];

    // TODO: EtcDetailTable 관련 데이터  
    const detailTableColGroup = ['162', '162', '162', '162', '162', '162', '162', '162', '162', '162'];
    const detailTableHead = [
        [
            { itemName: ['일시'], rowSpan: 2 },
            { itemName: ['스탬프'], colSpan: 3, className: 'price-area boder-th-b' },
            { itemName: ['무료음료쿠폰(스탬프적립&월간랭킹보상)'], colSpan: 3, className: 'boder-th-a' },
            { itemName: ['바나포인트 (적립&월간뱅킹보상)'], colSpan: 3, className: 'price-area boder-th-b' }
        ],
        [
            { itemName: ['지급 수'], className: 'price-area height-63' },
            { itemName: ['쿠폰전환 수'], className: 'price-area height-63' },
            { itemName: ['유효기간 소멸 수'], className: 'price-area height-63' },
            { itemName: ['발급 수', '금액'], className: 'height-63' },
            { itemName: ['사용 수', '금액'], className: 'height-63' },
            { itemName: ['유효기간 소멸 수', '금액'], className: 'height-63' },
            { itemName: ['적립'], className: 'price-area height-63' },
            { itemName: ['사용'], className: 'price-area height-63' },
            { itemName: ['유효기간 소멸'], className: 'price-area height-63' },
        ],
    ];

    return (
        <section className="container">
            <header>
                <div className="page-title membership">
                    <p className="present">멤버십현황</p>
                    <p className="spot">스탬프/쿠폰/바나포인트</p>
                </div>
            </header>
            <section className="contents-wrap membership_current">
                <div className='contents'>
                    <div className="info-wrap">
                        <p>※ 매장의 스탬프, 무료음료쿠폰, 바나포인트의 적립/사용 현황을 조회할 수 있습니다. (최대 12개월 이내)</p>
                    </div>
                    <div className="board-date-wrap">
                        <ExtraOverall tableHead={thead} />
                        <ExtraDetail detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
                    </div>
                </div>
            </section>
        </section>
    )
}

export default ExtraContainer;