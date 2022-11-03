import { FC } from "react";

const ClaimTab:FC = () => {

    return (
        <ul className="tab-wrap">
            <li className="tab active" data-tab="tab1">클레임 내역전체</li>
            <li className="tab" data-tab="tab2">정산 내역 조회</li>
        </ul>
    );
}

export default ClaimTab;