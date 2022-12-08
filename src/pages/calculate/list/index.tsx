import loadable from "@loadable/component";
import { FC, useRef, useState } from "react";

// Type
import { CalculateLastMonthOutput, CalculateLastMonthTotalQueryResult, CALCULATE_TYPE } from "types/calculate/calculateType";

// State
import { useRecoilValue } from "recoil";
import { franState, loginState } from "state";

// Date
import { format, subMonths } from "date-fns";

// Component
import CalculateSection from "pages/calculate/component/CalculateSection";
import CalculateListTable from "./CalculateListTable";
import CalculatePrecautions from "../component/CalculatePrecautions";
import PDFCalculateListTable from "./PDFCalculateListTable";
import CalculateListTableTop from "./CalculateListTableTop";
import CalculateListTableBotton from "./CalculateListTableBotton";

const CalculateConfirmModal = loadable(() => import('pages/calculate/list/modal/CalculateConfirmModal'));
const RequestModifyModal = loadable(() => import('pages/calculate/list/modal/RequestModifyModal'));
const ChangeHistoryModal = loadable(() => import('pages/calculate/list/modal/ChangeHistoryModal'));

const CalculateList: FC = () => {

    const caculateType = CALCULATE_TYPE.LIST;

    // 사용자 정보
    const { userInfo } = useRecoilValue(loginState);
    const f_code = useRecoilValue(franState);
    const f_code_name = userInfo?.f_list.length > 0 ? Object.values(userInfo?.f_list).filter((item: any) => item.f_code === f_code)[0]?.f_code_name : '';
    const staff_no = userInfo?.staff_no || 0;

    // 수정요청, 수정요청/변경이력 팝업
    const [popupInfo, setPopupInfo] = useState<PopupInfo>({ calculateConfirm: false, requestModify: false, changeHistory: false });
    const { calculateConfirm, requestModify, changeHistory } = popupInfo;
    const handlePopup = (key: string, value: boolean) => {
        setPopupInfo(prev => ({ ...prev, [key]: value }));
    };

    // list 조회 월
    const stdMonth = format(subMonths(new Date(), 1), 'yyyy-MM');
    const [searchDate, setSearchDate] = useState(stdMonth);

    // list 조회 후 outPut 데이터
    const [outPut, setOutput] = useState<Pick<CalculateLastMonthTotalQueryResult, 'sumAll'> & Omit<CalculateLastMonthOutput, 'error_msg'>>({
        sumAll: 0,
        calculate_status: -1,
        calculate_id: 0,
    });
    const { calculate_id, calculate_status, sumAll } = outPut;

    // listRefetchFn
    const [listRefetchFn, setListRefetchFn] = useState<() => Promise<void>>(async () => undefined);

    // PDF 다운로드
    const [isPDF, setIsPDF] = useState(false);

    // Table
    const tableRef = useRef<null | HTMLTableElement>(null);

    return (
        <>
            <CalculateSection caculateType={caculateType} >
                <CalculatePrecautions caculateType={caculateType} />
                <CalculateListTableTop listRefetchFn={listRefetchFn} calculateStatus={calculate_status} fCode={f_code} staffNo={staff_no} searchDate={searchDate} handlePopup={handlePopup} setSearchDate={setSearchDate} />
                <CalculateListTable tableRef={tableRef} userInfo={{ f_code, f_code_name, staff_no }} searchDate={searchDate} setOutput={setOutput} setListRefetchFn={setListRefetchFn} />
                <CalculateListTableBotton calculateStatus={calculate_status} sumAll={sumAll} tableRef={tableRef} searchDate={searchDate} fCodeName={f_code_name} setIsPDF={setIsPDF} />
                {isPDF && <PDFCalculateListTable userInfo={{ f_code, f_code_name, staff_no }} searchDate={searchDate} outPut={outPut} isPDF={true} setIsPDF={setIsPDF} />}
            </CalculateSection>
            {calculateConfirm && <CalculateConfirmModal staffNo={staff_no} calculateId={calculate_id} handlePopup={handlePopup} listRefetchFn={listRefetchFn} />}
            {requestModify && <RequestModifyModal staffNo={staff_no} calculateId={calculate_id} handlePopup={handlePopup} />}
            {changeHistory && <ChangeHistoryModal staffNo={staff_no} fCode={f_code} calculateId={calculate_id} handlePopup={handlePopup} />}
        </>
    );
}

export default CalculateList;



// Component Type
type PopupInfo = {
    calculateConfirm: boolean,
    requestModify: boolean,
    changeHistory: boolean,
};