import { FC, MouseEventHandler } from "react";

// Type
import { CLAIM_TAB_TYPE, TabType } from "types/calculate/calculateType";

interface ClaimTabProps {
    tabType: TabType,
    setTabType: React.Dispatch<React.SetStateAction<TabType>>,
};
const CalculateClaimTab: FC<ClaimTabProps> = ({ tabType, setTabType }) => {

    const handleTab:MouseEventHandler<HTMLElement> = (e) => {
        const value = e.currentTarget.dataset.type as TabType;
        setTabType(prev => value);
    };

    return (
        <ul className="tab-wrap">
            {
                Object.keys(TAB_TITLE).map((type, index) => (
                    <li key={index} className={`tab ${type === tabType ? 'active' : ''}`} data-type={type} onClick={handleTab} >
                        {TAB_TITLE[type as keyof typeof TAB_TITLE]}
                    </li>
                ))
            }
        </ul>
    );
}

export default CalculateClaimTab;



// Component Type
const TAB_TITLE = {
    [CLAIM_TAB_TYPE.CLAIM]: '클레임 내역전체',
    [CLAIM_TAB_TYPE.CALCULATE]: '정산 내역 조회',
} as const;