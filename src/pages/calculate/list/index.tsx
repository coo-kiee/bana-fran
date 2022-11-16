import loadable from "@loadable/component";
import { FC, useState } from "react";

// Type
import { CalculateStatusType, CALCULATE_TYPE } from "types/calculate/calculateType";

// State
import { useRecoilValue } from "recoil";
import { franState, loginState } from "state";

// Component
import CalculateHeader from "pages/calculate/component/CalculateHeader";
import CalculateListTable from "./CalculateListTable";
import CalculatePrecautions from "../component/CalculatePrecautions";
import Loading from "pages/common/loading";

const ChangeHistory = loadable(() => import('pages/calculate/list/ChangeHistory'));
const RequestModify = loadable(() => import('pages/calculate/list/RequestModify'));

const CalculateList: FC = () => {

    const caculateType = CALCULATE_TYPE.LIST;
    
    // 사용자 정보
    const { userInfo } = useRecoilValue(loginState);
    const f_code = useRecoilValue(franState);
    const f_code_name = userInfo?.f_list[0]?.f_code_name || '';
    const staff_no = userInfo?.staff_no || 0;

    // 수정요청, 수정요청/변경이력 팝업
    const [popupInfo, setPopupInfo] = useState({ requestModify: false, changeHistory: false });
    const {requestModify, changeHistory} = popupInfo;
    const handlePopup = (key: string, value: boolean) => {
        setPopupInfo(prev => ({ ...prev, [key]: value }));
    };

    // list 조회 후 outPut 데이터
    const [outPut, setOutput] = useState<{ sumAll: number, calculateStatus: CalculateStatusType, calculateId: number }>({ sumAll: 0, calculateStatus: -1, calculateId: 0 });

    // PDF 다운로드
    const [isPDF, setIsPDF] = useState(false);

    return (
        <>
            <section className="container">
                <CalculateHeader caculateType={caculateType} />
                <section className="contents-wrap calculate-wrap">
                    <div className="contents">
                        <CalculatePrecautions caculateType={caculateType} />
                        {isPDF && <div style={{ position: 'absolute', zIndex: 100, width: '100%', height: '100%', display: 'flex', paddingTop:'300px' }}><Loading /></div>}
                        <CalculateListTable userInfo={{ f_code, f_code_name, staff_no }} outPut={outPut} setOutput={setOutput} handlePopup={handlePopup} setIsPDF={setIsPDF} />
                        {isPDF && <div style={{ opacity: 0, width:'2270px' }}><CalculateListTable userInfo={{ f_code, f_code_name, staff_no }} outPut={outPut} setOutput={setOutput} handlePopup={handlePopup} isPDF={true} setIsPDF={setIsPDF} /></div>}
                    </div>
                </section>
            </section>
            { requestModify && <RequestModify staffNo={staff_no} calculateId={outPut.calculateId} handlePopup={handlePopup} />}
            { changeHistory && <ChangeHistory staffNo={staff_no} fCode={f_code} calculateId={outPut.calculateId}  handlePopup={handlePopup} />}
        </>
    );
}

export default CalculateList;