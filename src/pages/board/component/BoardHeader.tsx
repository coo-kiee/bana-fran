import { FC } from "react";

// Type
import { MenuType, MENU_TYPE } from "types/board/boardType";

const BoardHeader: FC<{ menuType: MenuType }> = ({ menuType }) => {

    return (
        <header>
            <div className={`page-title ${CLASS_NAME[menuType]}`}>
                <p className="present">{menuType === MENU_TYPE.NOTICE ? '공지사항' : '자료실'}</p>
            </div>
        </header>
    );
}

export default BoardHeader;



// Component Type
const CLASS_NAME = {
    [MENU_TYPE.NOTICE]: 'notice',
    [MENU_TYPE.BOARD]: 'dataroom',
}