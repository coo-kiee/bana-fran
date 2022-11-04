import loadable from "@loadable/component";
import { FC, useState } from "react";

// Type
import { CaculateType, CACULATE_TYPE } from "types/caculate/caculateType";

// Component
import CaculateHeader from "pages/caculate/component/CaculateHeader";
import CaculatePrecautions from "pages/caculate/component/CaculatePrecautions";
import CaculateListTable from "./CaculateListTable";

const ChangeHistory = loadable(() => import('pages/caculate/list/ChangeHistory'));
const RequestModify = loadable(() => import('pages/caculate/list/RequestModify'));

// interface CaculateListProps {
//     caculateType: CaculateType,
// };
const CaculateList: FC = () => {

    const caculateType = CACULATE_TYPE.LIST;
    const [popupInfo, setPopupInfo] = useState({ requestModify: false, changeHistory: false });
    const {requestModify, changeHistory} = popupInfo;
    const handlePopup = (key: string, value: boolean) => {
        setPopupInfo(prev => ({ ...prev, [key]: value }));
    };

    return (
        <>
            <section className="container">
                <CaculateHeader caculateType={caculateType} />
                <section className="contents-wrap calculate-wrap">
                    <div className="contents">
                        <CaculatePrecautions caculateType={caculateType} />
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