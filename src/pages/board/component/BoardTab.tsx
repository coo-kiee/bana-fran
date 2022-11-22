import { FC, MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";

// Type
import { BoardInfo, BOARD_GROUP, MenuType } from "types/board/boardType";
import { DetailInfo } from "..";

interface BoardTabProps {
    menuType: MenuType,
    boardType: BoardInfo['type'],
    detailInfo: DetailInfo,
};
const BoardTab: FC<BoardTabProps> = ({ menuType, boardType, detailInfo }) => {

    const navigation = useNavigate();
    
    // Tab(BoardInfo) 변경
    const handleBoardInfo: MouseEventHandler<HTMLDivElement> = (e) => {
        const bType = Number(e.currentTarget.dataset.type as string) as BoardInfo['type'];
        navigation(`/${menuType}/${bType}${detailInfo[bType] > 0 ? '/' + detailInfo[bType] : ''}`); // 이동하려는 게시판(탭)에 boardId 있으면 URL 파리미터 추가
    };

    return (
        <div className="tab-wrap">
            {
                Object.values(BOARD_GROUP[menuType]).map((boardObj, index) => {
                    const { title, type } = boardObj;
                    return (
                        <div key={index} className={type === boardType ? "tab active" : "tab"} data-type={type} onClick={handleBoardInfo}>{title}</div>
                    )
                })
            }
        </div>
    );
}

export default BoardTab;