import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import loadable from '@loadable/component';

// type
import { ETC_TAB_LIST, ETC_TAB_TYPE } from 'types/etc/etcType';

// component  
import DeliveryCharge from './deliveryCharge';
import GiftCard from './giftcard';
import MusicCharge from './musicCharge';
import OrderDetail from './orderDetail';
import Royalty from './royalty';
import VirtualAccount from './virtualAccount'; 

// state
import { orderDetailModalState } from 'state';

const EtcContainer = () => {
    const EtcOrderModal = loadable(() => import('./component/EtcOrderDetail'));
    const { show } = useRecoilValue(orderDetailModalState);

    // TODO: 상태 관련
    const [currTab, setCurrTab] = useState(0); // 선택된 탭 메뉴 관련 

    // TODO: 내부 컴포넌트 관련
    const tabList = {
        [ETC_TAB_TYPE.DELIVERY]: { title: '바나 딜리버리 수수료', subtitle:'※ 바나 딜리버리 수수료 내역을 조회할 수 있습니다.', id: 'tab1', component: <DeliveryCharge /> },
        [ETC_TAB_TYPE.MUSIC]: { title: '음악 서비스 이용료', subtitle: '※ 매월 매장 음악 서비스 이용료를 조회할 수 있습니다.', id: 'tab2', component: <MusicCharge /> },
        [ETC_TAB_TYPE.GIFTCARD]: { title: '실물상품권 발주/판매', subtitle: '※ 실물 상품권 발주/위탁판매내역을 조회할 수 있습니다.', id: 'tab3', component: <GiftCard /> },
        [ETC_TAB_TYPE.ORDER]: { title: '발주내역', subtitle: '※ 상세 발주 내역을 조회할 수 있습니다.', id: 'tab4', component: <OrderDetail /> },
        [ETC_TAB_TYPE.ROYALTY]: { title: '로열티', subtitle: '※ 매월 매장 로열티를 조회할 수 있습니다.', id: 'tab5', component: <Royalty /> },
        [ETC_TAB_TYPE.ACCOUNT]: { title: '가상계좌 충전/차감', subtitle: '※ 가상계좌 충전/차감 내역을 조회할 수 있습니다.', id: 'tab6', component: <VirtualAccount /> },
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
                        <ul className="tab-wrap">
                            {ETC_TAB_LIST.map((type: number, idx: number) => {
                                return <li key={`etc_tab_${idx}`} className={`tab ${currTab === idx && 'active'}`} data-tab={`tab${idx}`} onClick={() => setCurrTab((prevTab) => idx)}>{tabList[type].title}</li>
                            })} 
                        </ul>

                        <div id={`${tabList[currTab].id}`} className="tab-content active">
                            <div className="info-wrap">
                                <p>{tabList[currTab].subtitle} {currTab !== ETC_TAB_TYPE.ACCOUNT && <strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong>}</p> 
                            </div>
                            {tabList[currTab].component}
                        </div>
                    </div>
                </section>
            </section>
            {show && <EtcOrderModal />}
        </>
    )
}

export default EtcContainer;