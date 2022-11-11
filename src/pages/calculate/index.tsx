import loadable from "@loadable/component";
import { CalculateType, CALCULATE_TYPE } from "types/calculate/calculateType";

// Component
// const CalculateList = loadable(() => import('pages/caculate/list'));
// const CalculatePoint = loadable(() => import('pages/caculate/point'));
// const CalculateCoupon = loadable(() => import('pages/caculate/coupon'));
// const CalculateClaim = loadable(() => import('pages/caculate/claim'));
// const CalculateEtc = loadable(() => import('pages/caculate/etc'));

const Calculate = () => {

    // const currentUrl = window.location.href;
    // const idx = currentUrl.indexOf('caculate');
    // const caculateType = currentUrl.substring(idx + 'caculate'.length + 1) as CalculateType;
    // console.log(caculateType);
    
    // const renderComponent = (caculateType: CalculateType) => {
    //     switch (caculateType) {
    //         case CALCULATE_TYPE.LIST:
    //             return <CalculateList caculateType={caculateType} />;
    //         case CALCULATE_TYPE.POINT:
    //             return <CalculatePoint caculateType={caculateType} />;
    //         case CALCULATE_TYPE.COUPON:
    //             return <CalculateCoupon caculateType={caculateType} />;
    //         case CALCULATE_TYPE.CLAIM:
    //             return <CalculateClaim caculateType={caculateType} />;
    //         case CALCULATE_TYPE.ETC:
    //             return <CalculateEtc caculateType={caculateType} />;
    //     };
    // };

    return (
        <>
            {/* {renderComponent(caculateType)} */}
        </>
    );
}

export default Calculate;