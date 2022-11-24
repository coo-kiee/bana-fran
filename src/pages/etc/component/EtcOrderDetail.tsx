import { useRecoilState } from 'recoil';
import React from 'react';
import Utils from 'utils/Utils';

// type
import { OrderDetailModalParams, OrderDetailModalItemType } from 'types/etc/etcType';

// state
import { orderDetailModalState } from 'state';

// service 
import ETC_SERVICE from 'service/etcService';

// component
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

const EtcOrderDetail = () => {
    const [modalState, setModalState] = useRecoilState(orderDetailModalState);

    // TODO: EtcTable 내부 데이터 관련 
    const colGroup = ['226', '100', '100', '100', '100', '100', '191'];
    const thead = [
        ['품목', '단가', '수량', '공급가', '부가세', '합계(발주금액)', '특이사항'],
    ];

    // TODO: 프로시저
    let tbody: Array<OrderDetailModalItemType> = [];
    let total: Array<OrderDetailModalItemType> = [];

    const orderDetailModalParams: OrderDetailModalParams = { order_code: modalState.orderCode };
    const { data, isSuccess, isLoading, isError } = ETC_SERVICE.useOrderDetailModal(orderDetailModalParams);
    if (isSuccess) {
        tbody = [...tbody, ...data.slice(0, data.length - 1)];
        total = [...total, data[data.length - 1]];
    };

    const handleModalClose = () => {
        setModalState((prev) => ({ ...prev, show: false })); // 끄기
    };

    return (
        <div className="alert-layer order-layer active">
            <div className="msg-wrap">
                <p className="title">발주 품목 상세</p>
                {isLoading ?
                    <div style={{ width: 900, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loading /></div>
                    :
                    <>
                        <div style={{ 'overflowY': 'auto', 'maxHeight': 500 }}>
                            <table className="board-wrap" cellPadding="0" cellSpacing="0">
                                <colgroup>
                                    {colGroup.map((col, idx) => <col key={`etc_order_detail_table_col_${idx}`} width={col} />)}
                                </colgroup>
                                <thead>
                                    {thead.map((trData, idx1) => {
                                        return (
                                            <tr key={`etc_order_detail_table_head_${idx1}`}>
                                                {trData.map((thData, idx2) => <th key={`etc_order_detail_table_headitem_${idx2}`} >{thData}</th>)}
                                            </tr>
                                        )
                                    })}
                                </thead>
                                <tbody>
                                    {isError && <SuspenseErrorPage isTable={true} />}
                                    {isSuccess &&
                                        <>
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
                                        </>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <button className="btn-close order-close" onClick={handleModalClose}></button>
                        <button className="cta-btn" onClick={handleModalClose}>확인</button>
                    </>
                }
            </div>
        </div>
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