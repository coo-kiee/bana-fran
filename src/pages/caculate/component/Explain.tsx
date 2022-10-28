// Type
import { CaculateType, CACULATE_TYPE } from "types/caculate/caculateType";

// Data
import { EXPLAIN_INFO } from "../data/Explain";

const Explain = () => {

    const temp: CaculateType[keyof CaculateType] = CACULATE_TYPE.LIST;
    return (
        <div className="info-wrap">
            {
                EXPLAIN_INFO[temp].map((text, index) => <p key={index}>{text}</p>)
            }
        </div>
    );
}

export default Explain;