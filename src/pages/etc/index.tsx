import { useState } from 'react';
import { useRecoilValue } from 'recoil';

// type
import { ETC_TAB_LIST, ETC_TAB_TYPE } from 'types/etc/etcType';

// component  
import DeliveryCharge from './deliveryCharge';
import GiftCard from './giftcard';
import MusicCharge from './musicCharge';
import OrderDetail from './orderDetail';
import Royalty from './royalty';
import VirtualAccount from './virtualAccount';
import EtcOrderDetail from './component/EtcOrderDetail';

// state
import { orderDetailModalState } from 'state';

const EtcContainer = () => {
    // TODO: 상태 관련
    const [currTab, setCurrTab] = useState(0); // 선택된 탭 메뉴 관련 
    const { show } = useRecoilValue(orderDetailModalState);

    // TODO: 내부 컴포넌트 관련
    const tabList = {
        [ETC_TAB_TYPE.DELIVERY]: { title: '바나 딜리버리 수수료', subtitle: <p>※ 바나 딜리버리 수수료 내역을 조회할 수 있습니다. <strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>, id: 'tab1', component: <DeliveryCharge /> },
        [ETC_TAB_TYPE.MUSIC]: { title: '음악 서비스 이용료', subtitle: <p>※ 매월 매장 음악 서비스 이용료를 조회할 수 있습니다. <strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>, id: 'tab2', component: <MusicCharge /> },
        [ETC_TAB_TYPE.GIFTCARD]: { title: '실물상품권 발주/판매', subtitle: <p>※ 실물 상품권 발주/위탁판매내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>, id: 'tab3', component: <GiftCard /> },
        [ETC_TAB_TYPE.ORDER]: { title: '발주내역', subtitle: <p>※ 상세 발주 내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>, id: 'tab4', component: <OrderDetail /> },
        [ETC_TAB_TYPE.ROYALTY]: { title: '로열티', subtitle: <p>※ 매월 매장 로열티를 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.) </strong></p >, id: 'tab5', component: <Royalty /> },
        [ETC_TAB_TYPE.ACCOUNT]: { title: '가상계좌 충전/차감', subtitle: <p>※ 가상계좌 충전/차감 내역을 조회할 수 있습니다.</p>, id: 'tab6', component: <VirtualAccount /> },
    };

    return (
        <>
            <section className="container">
                <header>
                    <div className="page-title etc">
                        <p className="present">기타내역</p>
                    </div>
                </header>
                <section className="contents-wrap etc-wrap">
                    <div className='contents'>
                        <ul className="tab-wrap"> {/* 탭메뉴 */}
                            {ETC_TAB_LIST.map((type: number, idx: number) => {
                                return <li key={`etc_tab_${idx}`} className={`tab ${currTab === idx && 'active'}`} data-tab={`tab${idx}`} onClick={() => setCurrTab((prevTab) => idx)}>{tabList[type].title}</li>
                            })}
                        </ul>

                        <div id={`${tabList[currTab].id}`} className="tab-content active">
                            <div className="info-wrap">
                                {tabList[currTab].subtitle}
                            </div>

                            {tabList[currTab].component}
                        </div>
                    </div>
                </section>
            </section>
            {show && <EtcOrderDetail />}
        </>
    )
}

export default EtcContainer;