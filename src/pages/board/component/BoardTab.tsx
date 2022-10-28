import { FC, MouseEventHandler } from "react";

// Type
import { BoardType, BOARD_GROUP, ListSearchCondition, MenuType } from "types/board/boardType";

interface BoardTabProps {
    menuType: MenuType,
    boardType: BoardType['type'],
    setListSearchCondition: React.Dispatch<React.SetStateAction<ListSearchCondition>>
};
const BoardTab: FC<BoardTabProps> = ({ menuType, boardType, setListSearchCondition }) => {

    const handleBoardType: MouseEventHandler<HTMLDivElement> = (e) => {
        const value = e.currentTarget.dataset.tab as string;
        const board_type = parseInt(value) as unknown as BoardType['type'];
        // Tab(BoardType) 바꿀때 현재페이지, 카테고리, 카테고리 제목 검색 초기화
        setListSearchCondition(prev => ({ ...prev, board_type, page_idx: 1, search_category: 0, search_text: "" }));
    };

    return (
        <div className="tab-wrap">
            {
                Object.values(BOARD_GROUP[menuType]).map((boardObj, index) => {
                    const { title, type } = boardObj;
                    return (
                        <div key={index} className={type === boardType ? "tab active" : "tab"} data-tab={type} onClick={handleBoardType}>{title}</div>
                    )
                })
            }
        </div>
    );
}

export default BoardTab;