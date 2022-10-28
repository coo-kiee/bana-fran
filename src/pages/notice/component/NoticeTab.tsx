import { useState } from "react";

// Type
import { BOARD_TYPE } from "types/board/boardType";
import { NoticeTabType, NOTICE_TAB } from "types/notice/noticeType";

const NoticeTab = () => {

    const [tabType, setTabType] = useState<NoticeTabType['boradType']>(BOARD_TYPE.CALCULATION);
    const handleTabType = (boradType: NoticeTabType['boradType']) => {
        setTabType(boradType);
    };

    return (
        <div className="tab-wrap">
            {
                Object.values(NOTICE_TAB).map((tabObj, index) => {
                    const { title, boradType } = tabObj;
                    return (
                        <div key={index} className={boradType === tabType ? "tab active" : "tab"} data-tab={`tab` + (index + 1)} onClick={() => handleTabType(boradType)}>{title}</div>
                    )
                })
            }
        </div>
    );
}

export default NoticeTab;