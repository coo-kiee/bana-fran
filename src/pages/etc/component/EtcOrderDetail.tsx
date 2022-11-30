import React, { Suspense } from 'react';
import { useRecoilState } from 'recoil';
import Utils from 'utils/Utils';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

// type
import { OrderDetailModalParams, OrderDetailModalItemType } from 'types/etc/etcType';

// state
import { orderDetailModalState } from 'state';

// service 
import ETC_SERVICE from 'service/etcService';

// component
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import{EtcDetailTableHead} from "pages/etc/component/EtcDetailTable";

const EtcOrderDetail = () => {
    const { reset } = useQueryErrorResetBoundary();  
    return (
        <div className="alert-layer order-layer active" style={{position: 'fixed'}}>
            <div className="msg-wrap">
                <p className="title">발주 품목 상세</p>
                <Suspense fallback={<div style={{ width: 900, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loading /></div>}>
                    <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <div style={{ width: 900, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><SuspenseErrorPage resetErrorBoundary={resetErrorBoundary}/></div>} >
                        <EtcOrderDetailData />
                    </ErrorBoundary>
                </Suspense>
            </div>
        </div>
    )
}

const EtcOrderDetailData = () => {
    const [modalState, setModalState] = useRecoilState(orderDetailModalState);
    const colGroup = ['226', '100', '100', '100', '100', '100', '191'];
    const thead = [
        [{itemName: '품목'}, {itemName: '단가'}, {itemName: '수량'}, {itemName: '공급가'}, {itemName: '부가세'}, {itemName: '합계(발주금액)'}, {itemName: '특이사항'}],
    ];

    const handleModalClose = () => {
        setModalState((prev) => ({ ...prev, show: false })); // 끄기
    };

    // 프로시저
    let tbody: Array<OrderDetailModalItemType> = [];
    let total: Array<OrderDetailModalItemType> = [];
    const orderDetailModalParams: OrderDetailModalParams = { order_code: modalState.orderCode };
    const { data, isSuccess } = ETC_SERVICE.useOrderDetailModal(orderDetailModalParams);
    if (isSuccess) {
        tbody = [...tbody, ...data.slice(0, data.length - 1)];
        total = [...total, data[data.length - 1]];
    };

    return (
        <>
        <div style={{ 'overflowY': 'auto', 'maxHeight': 500 }}>
            <table className="board-wrap" cellPadding="0" cellSpacing="0">
                <EtcDetailTableHead detailTableColGroup={colGroup} detailTableHead={thead}/>
                <tbody> 
                    {tbody.map((el, idx) => <EtcOrderDetailItem key={`etc_order_detail_item_${idx}`} {...el} />)}
                    {total.map((el, idx) => {
                        return (
                            <tr key={`etc_order_detail_item_total_${idx}`}>
                                <td className="result total etc-total" colSpan={5}><strong>합계</strong></td>
                                <td className="point result total etc-total"><strong>{Utils.numberComma(el.total_amount)}</strong></td>
                                <td className="result total etc-total"></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
            <button className="btn-close order-close" onClick={handleModalClose}></button>
            <button className="cta-btn" onClick={handleModalClose}>확인</button>
        </>
    )
}
const EtcOrderDetailItem: React.FC<OrderDetailModalItemType> = (props) => {
    const { fOrderCount, fran_price, nEAPerPack, sDeliveryUnit, sEtc, sGroup, sItemShort, suply_amount, tax_amount, total_amount, volume } = props;

    return (
        <tr>
            <td className="content">
                <p>{sGroup}</p>
                <strong>{sItemShort} ({volume})</strong>
                <p>배송단위/용량<span className="colon"></span>1{sDeliveryUnit}/{nEAPerPack}개</p>
            </td>
            <td>{Utils.numberComma(fran_price)}</td>
            <td className="align-right">{fOrderCount}</td>
            <td>{Utils.numberComma(suply_amount)}</td>
            <td>{Utils.numberComma(tax_amount)}</td>
            <td><strong>{Utils.numberComma(total_amount)}</strong></td>
            <td>{sEtc}</td>
        </tr>
    )
}

export default EtcOrderDetail