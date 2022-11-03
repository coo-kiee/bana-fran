import loadable from "@loadable/component";
import { useState } from "react";

// Component
import CaculateHeader from "../CaculateHeader";
import CaculatePrecautions from "../CaculatePrecautions";
import CaculateListTable from "./CaculateListTable";

const ChangeHistory = loadable(() => import('pages/caculate/component/list/ChangeHistory'));
const RequestModify = loadable(() => import('pages/caculate/component/list/RequestModify'));

const CaculateList = () => {

    const [popupInfo, setPopupInfo] = useState({ requestModify: false, changeHistory: false });
    const {requestModify, changeHistory} = popupInfo;
    const handlePopup = (key: string, value: boolean) => {
        setPopupInfo(prev => ({ ...prev, [key]: value }));
    };

    return (
        <>
            <section className="container">
                <CaculateHeader />
                <section className="contents-wrap calculate-wrap">
                    <div className="contents">
                        <CaculatePrecautions />
                        <CaculateListTable handlePopup={handlePopup} />
                    </div>
                </section>
            </section>
            { requestModify && <RequestModify handlePopup={handlePopup} />}
            { changeHistory && <ChangeHistory handlePopup={handlePopup} />}
        </>
    );
}

export default CaculateList;