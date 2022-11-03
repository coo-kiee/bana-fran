
// Type
import { FC } from "react";
import { CaculateType } from "types/caculate/caculateType";

// Component
import CaculateHeader from "pages/caculate/component/CaculateHeader";
import CaculatePrecautions from "pages/caculate/component/CaculatePrecautions";
import EtcDetailTable from "./EtcDetailTable";
import EtcLastMonthTable from "./EtcLastMonthTable";

interface CaculateEtcProps {
    caculateType: CaculateType,
};
const CaculateEtc: FC<CaculateEtcProps> = ({ caculateType }) => {

    return (
        <>
            <section className="container">
                <CaculateHeader caculateType={caculateType} />
                <section className="contents-wrap cal-etc-wrap">
                    <div className="contents">
                        <CaculatePrecautions caculateType={caculateType} />
                        <div className="board-date-wrap">
                            <EtcLastMonthTable />
                            <EtcDetailTable />
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
}

export default CaculateEtc;