
// Type
import { FC } from "react";
import { CALCULATE_TYPE } from "types/calculate/calculateType";

// Component
import CalculateHeader from "pages/calculate/component/CalculateHeader";
import CalculatePrecautions from "pages/calculate/component/CalculatePrecautions";
import EtcDetailTable from "./EtcDetailTable";
import EtcLastMonthTable from "./EtcLastMonthTable";

const CalculateEtc: FC = ( ) => {

    const caculateType = CALCULATE_TYPE.ETC;

    return (
        <>
            <section className="container">
                <CalculateHeader caculateType={caculateType} />
                <section className="contents-wrap cal-etc-wrap">
                    <div className="contents">
                        <CalculatePrecautions caculateType={caculateType} />
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

export default CalculateEtc;