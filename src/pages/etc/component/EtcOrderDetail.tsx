// type
import { EtcOrderDetailProps } from 'types/etc/etcType';

const EtcOrderDetail: React.FC<EtcOrderDetailProps> = ({ popupOrderDetail, setPopupOrderDetail }) => {
    // TODO: EtcTable 내부 데이터 관련 
    const colGroup = ['226', '100', '100', '100', '100', '100', '191'];
    const thead = ['품목', '단가', '수량', '공급가', '부가세', '합계(발주금액)', '특이사항'];
    const tbody = [
        // 프로시저 데이터 확인 뒤 변경하기
    ];

    const handleEtcOrderDetail = () => {
        setPopupOrderDetail((prev) => ({ ...prev, show: false })); // 끄기
    }

    return (
        <div className="alert-layer order-layer active">
            <div className="msg-wrap">
                {/* <EtcTable title={`발주 품목 상세`} colGroup={colGroup} thead={thead} tbody={tbody} /> */}
                <p className="title">발주 품목 상세</p>
                <table className="board-wrap" cellPadding="0" cellSpacing="0">
                    <colgroup>
                        <col width="226" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="100" />
                        <col width="191" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>품목</th>
                            <th>단가</th>
                            <th>수량</th>
                            <th>공급가</th>
                            <th>부가세</th>
                            <th>합계(발주금액)</th>
                            <th>특이사항</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="content">
                                <p>BEAN</p>
                                <strong>디카페인 원두(콜롬비아/500G)</strong>
                                <p>배송단위/용량<span className="colon"></span>1개/500g</p>
                            </td>
                            <td>10,000</td>
                            <td className="align-right">5</td>
                            <td>50,000</td>
                            <td></td>
                            <td><strong>50,000</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="content">
                                <p>BEAN</p>
                                <strong>디카페인 원두(콜롬비아/500G)</strong>
                                <p>배송단위/용량<span className="colon"></span>1개/500g</p>
                            </td>
                            <td>10,000</td>
                            <td className="align-right">5</td>
                            <td>50,000</td>
                            <td>50,000</td>
                            <td><strong>50,000</strong></td>
                            <td>
                                재고부족
                                <p>(4건발주)</p>
                            </td>
                        </tr>
                        <tr>
                            <td className="content">
                                <p>BEAN</p>
                                <strong>디카페인 원두(콜롬비아/500G)</strong>
                                <p>배송단위/용량<span className="colon"></span>1개/500g</p>
                            </td>
                            <td>10,000</td>
                            <td className="align-right">5</td>
                            <td>50,000</td>
                            <td>50,000</td>
                            <td><strong>50,000</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="content">
                                <p>BEAN</p>
                                <strong>디카페인 원두(콜롬비아/500G)</strong>
                                <p>배송단위/용량<span className="colon"></span>1개/500g</p>
                            </td>
                            <td>10,000</td>
                            <td className="align-right">5</td>
                            <td>50,000</td>
                            <td>50,000</td>
                            <td><strong>50,000</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="content">
                                <p>BEAN</p>
                                <strong>디카페인 원두(콜롬비아/500G)</strong>
                                <p>배송단위/용량<span className="colon"></span>1개/500g</p>
                            </td>
                            <td>10,000</td>
                            <td className="align-right">5</td>
                            <td>50,000</td>
                            <td>50,000</td>
                            <td><strong>50,000</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="result total etc-total" colSpan={5}><strong>합계</strong></td>
                            <td className="point result total etc-total"><strong>190,000</strong></td>
                            <td className="result total etc-total"></td>
                        </tr>
                    </tbody>
                </table>
                <button className="btn-close order-close" onClick={handleEtcOrderDetail}></button>
                <button className="cta-btn">확인</button>
            </div>
        </div>
    )
}

export default EtcOrderDetail