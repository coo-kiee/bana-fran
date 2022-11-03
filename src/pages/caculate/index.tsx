import loadable from "@loadable/component";
import { CaculateType, CACULATE_TYPE } from "types/caculate/caculateType";

// Component
const CaculateList = loadable(() => import('pages/caculate/component/list'));

const Calculate = () => {

    const currentUrl = window.location.href;
    const idx = currentUrl.indexOf('caculate');
    const caculateType = currentUrl.substring(idx + 'caculate'.length + 1) as CaculateType;
    console.log(caculateType);
    
    const renderComponent = (caculateType: CaculateType) => {
        switch (caculateType) {
            case CACULATE_TYPE.LIST:
                return <CaculateList />;
            case CACULATE_TYPE.POINT:
                return <CaculateList />;
            case CACULATE_TYPE.COUPON:
                return <CaculateList />;
            case CACULATE_TYPE.CLAIM:
                return <CaculateList />;
            case CACULATE_TYPE.ETC:
                return <CaculateList />;
        };
    };

    return (
        <>
            {renderComponent(caculateType)}
        </>
    );
}

export default Calculate;