import { FC, ReactNode } from "react";

// Type
import { MenuType, MENU_TYPE } from "types/board/boardType";

const BoardSection: FC<{ menuType: MenuType, isDetail: boolean, children: ReactNode }> = ({ menuType, isDetail, children }) => {

    return (
        <section className="container min-width-1200">
            <BoardHeader menuType={menuType} />
            <section className={`contents-wrap ${isDetail ? `notice-view-wrap` : 'notice-wrap'}`}>
                <div className="contents">
                    {children}
                </div>
            </section>
        </section>
    );
}

export default BoardSection;



const BoardHeader: FC<{ menuType: MenuType }> = ({ menuType }) => {

    return (
        <header>
            <div className={`page-title ${CLASS_NAME[menuType]}`}>
                <p className="present">{menuType === MENU_TYPE.NOTICE ? '공지사항' : '자료실'}</p>
            </div>
        </header>
    )
};

// Component Type
const CLASS_NAME = {
    [MENU_TYPE.NOTICE]: 'notice',
    [MENU_TYPE.BOARD]: 'dataroom',
}