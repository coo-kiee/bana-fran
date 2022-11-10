import { FC } from "react";

// Type
import { MenuType, MENU_TYPE } from "types/board/boardType";

const BoardHeader: FC<{ menuType: MenuType }> = ({ menuType }) => {

    return (
        <header>
            <div className={`page-title notice`}>
                <p className="present">{menuType === MENU_TYPE.NOTICE ? '공지사항' : '자료실'}</p>
            </div>
        </header>
    );
}

export default BoardHeader;