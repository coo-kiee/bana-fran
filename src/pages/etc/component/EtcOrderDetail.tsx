import React, { FC, Suspense, useEffect, useRef } from 'react'; 
import Utils from 'utils/Utils';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

// type
import { OrderDetailModalItemType, EtcOrderDetailProps } from 'types/etc/etcType';

// service 
import ETC_SERVICE from 'service/etcService';

// component
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import { EtcDetailTableHead } from "pages/etc/component/EtcDetailTable";
import Sticky from 'pages/common/sticky';

const EtcOrderDetail:FC<EtcOrderDetailProps> = ( props ) => { 
    const { reset } = useQueryErrorResetBoundary();  
    
    // Modal render시 body scroll방지
    useEffect(() => {
        if (document) { document.body.style.overflow = 'hidden'; }
        return () => { document.body.removeAttribute('style'); } // style 제거
    }, [])
    
    return (
        <div className="alert-layer order-layer active" style={{position: 'fixed'}}>
            <div className="msg-wrap">
                <p className="title">발주 품목 상세</p>
                <Suspense fallback={<div style={{ width: 900, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loading /></div>}>
                    <ErrorBoundary onReset={reset} fallbackRender={({ resetErrorBoundary }) => <div style={{ width: 900, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><SuspenseErrorPage resetErrorBoundary={resetErrorBoundary}/></div>} >
                        <EtcOrderDetailData {...props} />
                    </ErrorBoundary>
                </Suspense>
            </div>
        </div>
    )
}

const EtcOrderDetailData:FC<EtcOrderDetailProps> = ({ showOrderDetail, closeOrderDetailModal }) => { 
    const colGroup = ['226', '100', '100', '100', '100', '100', '191'];
    const thead = [
        [{itemName: '품목'}, {itemName: '단가'}, {itemName: '수량'}, {itemName: '공급가'}, {itemName: '부가세'}, {itemName: '합계(발주금액)'}, {itemName: '특이사항'}],
    ];

    // 프로시저
    let tbody: Array<OrderDetailModalItemType> = [];
    let total: Array<OrderDetailModalItemType> = [];
    const orderDetailModalParams = { order_code: showOrderDetail.orderCode };
    const { data, isSuccess } = ETC_SERVICE.useOrderDetailModal(orderDetailModalParams);
    if (isSuccess) {
        tbody = [...tbody, ...data.slice(0, data.length - 1)];
        total = [...total, data[data.length - 1]];
    };

	/* sticky ref */
    const stickyRootRef = useRef<HTMLDivElement>(null);      // sticky wrapper, viewport 역할 ref
	const stickyRef = useRef<HTMLTableRowElement>(null);     // sticky 기준 ref
    const contentsRefRef = useRef<HTMLTableElement>(null); // 실제 data table ref (sticky 작동용)

    return (
        <>
            <div style={{ 'overflowY': 'auto', 'maxHeight': 500, position: 'relative', marginTop: '30px' }} ref={stickyRootRef}>
                <Sticky reference={stickyRef.current} root={stickyRootRef.current} contentsRef={contentsRefRef.current}>
                    <EtcDetailTableHead detailTableColGroup={colGroup} detailTableHead={thead} />
                </Sticky>
                <table className="board-wrap" cellPadding="0" cellSpacing="0" style={{marginTop: 0}} ref={contentsRefRef}>
                    <EtcDetailTableHead detailTableColGroup={colGroup} detailTableHead={thead} ref={stickyRef} />
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
            <button className="btn-close order-close" onClick={closeOrderDetailModal}></button>
            <button className="cta-btn" onClick={closeOrderDetailModal}>확인</button>
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