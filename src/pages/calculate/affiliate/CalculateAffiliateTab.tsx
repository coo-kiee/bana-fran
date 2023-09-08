import { FC, MouseEventHandler } from "react";

// Type
import { AffilateTabType, AFFILIATE_TAB_TYPE, } from "types/calculate/calculateType";

interface ICalculateAffiliateTab {
    tabType: AffilateTabType,
    setTabType: React.Dispatch<React.SetStateAction<AffilateTabType>>,
};
const CalculateAffiliateTab: FC<ICalculateAffiliateTab> = ({ tabType, setTabType }) => {

    const handleTab:MouseEventHandler<HTMLElement> = (e) => {
        const value = e.currentTarget.dataset.type;
        if(value) setTabType(prev => Number(value) as AffilateTabType);
    };

    return (
        <ul className="tab-wrap">
            {
                Object.keys(TAB_TITLE).map((type, index) => (
                    <li key={index} className={`tab ${Number(type) === tabType ? 'active' : ''}`} data-type={type} onClick={handleTab} >
                        {TAB_TITLE[Number(type) as keyof typeof TAB_TITLE]}
                    </li>
                ))
            }
        </ul>
    );
}

export default CalculateAffiliateTab;



// Component Type
const TAB_TITLE = {
    [AFFILIATE_TAB_TYPE.COUPON]: '제휴사 쿠폰 결제',
    // [AFFILIATE_TAB_TYPE.POINT]: '제휴사 포인트 결제',
} as const;