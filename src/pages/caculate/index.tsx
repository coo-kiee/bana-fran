import loadable from "@loadable/component";
import { CaculateType, CACULATE_TYPE } from "types/caculate/caculateType";

// Component
const CaculateList = loadable(() => import('pages/caculate/list'));
const CaculatePoint = loadable(() => import('pages/caculate/point'));
const CaculateCoupon = loadable(() => import('pages/caculate/coupon'));
const CaculateClaim = loadable(() => import('pages/caculate/claim'));
const CaculateEtc = loadable(() => import('pages/caculate/etc'));

const Calculate = () => {

    const currentUrl = window.location.href;
    const idx = currentUrl.indexOf('caculate');
    const caculateType = currentUrl.substring(idx + 'caculate'.length + 1) as CaculateType;
    console.log(caculateType);
    
    const renderComponent = (caculateType: CaculateType) => {
        switch (caculateType) {
            case CACULATE_TYPE.LIST:
                return <CaculateList caculateType={caculateType} />;
            case CACULATE_TYPE.POINT:
                return <CaculatePoint caculateType={caculateType} />;
            case CACULATE_TYPE.COUPON:
                return <CaculateCoupon caculateType={caculateType} />;
            case CACULATE_TYPE.CLAIM:
                return <CaculateClaim caculateType={caculateType} />;
            case CACULATE_TYPE.ETC:
                return <CaculateEtc caculateType={caculateType} />;
        };
    };

    return (
        <>
            {renderComponent(caculateType)}
        </>
    );
}

export default Calculate;