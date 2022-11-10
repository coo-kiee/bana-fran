import loadable from "@loadable/component";
import { FC, useState } from "react";

// Type
import { CaculateStatusType, CACULATE_TYPE } from "types/caculate/caculateType";

// State
import { useRecoilValue } from "recoil";
import { loginState } from "state";

// Component
import CaculateHeader from "pages/caculate/component/CaculateHeader";
import CaculateListTable from "./CaculateListTable";
import CaculatePrecautions from "../component/CaculatePrecautions";
import Loading from "pages/common/loading";

const ChangeHistory = loadable(() => import('pages/caculate/list/ChangeHistory'));
const RequestModify = loadable(() => import('pages/caculate/list/RequestModify'));

const CaculateList: FC = () => {

    const caculateType = CACULATE_TYPE.LIST;
    
    // 사용자 정보
    const { userInfo } = useRecoilValue(loginState);
    const f_code = userInfo?.f_list[0]?.f_code || 0;
    const f_code_name = userInfo?.f_list[0]?.f_code_name || '';
    const staff_no = userInfo?.staff_no || 0;

    // 수정요청, 수정요청/변경이력 팝업
    const [popupInfo, setPopupInfo] = useState({ requestModify: false, changeHistory: false });
    const {requestModify, changeHistory} = popupInfo;
    const handlePopup = (key: string, value: boolean) => {
        setPopupInfo(prev => ({ ...prev, [key]: value }));
    };

    // list 조회 후 outPut 데이터
    const [outPut, setOutput] = useState<{ sumAll: number, calculateStatus: CaculateStatusType, calculateId: number }>({ sumAll: 0, calculateStatus: -1, calculateId: 0 });

    // PDF 다운로드
    const [isPDF, setIsPDF] = useState(false);

    return (
        <>
            <section className="container">
                <CaculateHeader caculateType={caculateType} />
                <section className="contents-wrap calculate-wrap">
                    <div className="contents">
                        <CaculatePrecautions caculateType={caculateType} />
                        {isPDF && <div style={{ position: 'absolute', zIndex: 100, width: '100%', height: '100%', display: 'flex', paddingTop:'300px' }}><Loading /></div>}
                        <CaculateListTable userInfo={{ f_code, f_code_name, staff_no }} outPut={outPut} setOutput={setOutput} handlePopup={handlePopup} setIsPDF={setIsPDF} />
                        {isPDF && <div style={{ opacity: 0, width:'2270px' }}><CaculateListTable userInfo={{ f_code, f_code_name, staff_no }} outPut={outPut} setOutput={setOutput} handlePopup={handlePopup} isPDF={true} setIsPDF={setIsPDF} /></div>}
                    </div>
                </section>
            </section>
            { requestModify && <RequestModify staffNo={staff_no} calculateId={outPut.calculateId} handlePopup={handlePopup} />}
            { changeHistory && <ChangeHistory staffNo={staff_no} fCode={f_code} calculateId={outPut.calculateId}  handlePopup={handlePopup} />}
        </>
    );
}

export default CaculateList;