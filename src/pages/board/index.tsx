import { FC, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate, useParams } from "react-router-dom";
import loadable from "@loadable/component";

// Type
import { BoardInfo, BOARD_GROUP, ListSearchCondition, MenuType, MENU_TYPE } from "types/board/boardType";

// state
import { useRecoilValue } from "recoil";
import { loginState } from "state";

// Util
import Utils from "utils/Utils";

// component
import BoardTab from "./component/BoardTab";
import BoardSelectCondition from "./component/BoardSelectCondition";
import BoardTable from "./component/BoardTable";
import BoardHeader from "./component/BoardHeader";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

const Loading = loadable(() => import('pages/common/loading'));
const BoardDetail = loadable(() => import('pages/board/component/detail/BoardDetail'));

const BoardContainer: FC<{ menuType: MenuType }> = ({ menuType = MENU_TYPE.BOARD }) => {

    const { bType = "0", bId = "0" } = useParams();
    const boardType = parseInt(bType);
    const isBoardType = !Utils.strNumberCheck(bType) && boardType > 0 && Object.values(BOARD_GROUP[menuType]).filter((boardInfo) => boardInfo.type === boardType).length > 0;
    const navigation = useNavigate();

    useEffect(() => { // 게시판 타입이 아닐 시 이전페이지로 이동
        if (boardType > 0 && !isBoardType) navigation(-1);
    }, [boardType, isBoardType, navigation]);

    useLayoutEffect(() => { // 게시판 탭 변경 & 게시판 상세 이동
        const boardId = parseInt(bId);
        const isBoardId = !Utils.strNumberCheck(bId) && boardId > 0;

        if(boardType === 0) { // 페이지 처음 로딩 시
            setListSearchCondition(prev => ({ ...prev, board_type: BOARD_GROUP[menuType][0].type }));
            setDetailInfo(prev => ({ ...prev, isDetail: false }));
        }
        else if (isBoardType && isBoardId) { // 게시판 상세이동
            setListSearchCondition(prev => ({ ...prev, board_type: boardType as BoardInfo['type'] }));
            setDetailInfo(prev => ({ ...prev, [boardType]: boardId, isDetail: true }));
        }
        else if (isBoardType) { // 게시판 탭 변경
            setListSearchCondition(prev => ({ ...prev, board_type: boardType as BoardInfo['type'] }));
            setDetailInfo(prev => ({ ...prev, isDetail: false }));
        }
    }, [menuType, boardType, bId, isBoardType]);

    const { userInfo } = useRecoilValue(loginState);

    // 리스트 검색 정보
    const initialData = {
        f_code: userInfo?.f_list[0]?.f_code || 0,
        staff_no: userInfo?.staff_no || 0,
        board_type: BOARD_GROUP[menuType][0].type,
        search_category: 0,
        search_text: "",
        page_idx: 1,
        page_size: 50,
    };
    const [listSearchCondition, setListSearchCondition] = useState<ListSearchCondition>(initialData);
    const { board_type, search_category, staff_no, f_code } = listSearchCondition;

    // 상세보기 정보 - 현재 메뉴 boardType들의 boardId + isDetail
    const initialDetail: DetailInfo = Object.values(BOARD_GROUP[menuType]).reduce((detailObj, boardInfo: BoardInfo) => {
        const boardType = boardInfo.type;
        const res = { ...detailObj, [boardType]: 0 };
        return res;
    }, { isDetail: false });
    const [detailInfo, setDetailInfo] = useState(initialDetail);
    const { isDetail, [board_type]: boardId } = detailInfo;

    return (
        <>
            {
                (boardType === 0 || isBoardType) &&
                <section className="container">
                    <BoardHeader menuType={menuType} />
                    <section className={`contents-wrap ${isDetail ? 'notice-view-wrap' : 'notice-wrap'}`}>
                        <div className="contents">
                            <BoardTab menuType={menuType} boardType={board_type} detailInfo={detailInfo} />
                            <div id="tab1" className="tab-content active">
                                {
                                    isDetail ?
                                        // 게시판 상세
                                        <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} onError={(e) => console.log('detailError', e)}>
                                            <Suspense fallback={<Loading marginTop={100} />}>
                                                <BoardDetail menuType={menuType} boardId={boardId} staffNo={staff_no} fCode={f_code} setDetailInfo={setDetailInfo}/>
                                            </Suspense>
                                        </ErrorBoundary>
                                        :
                                        // 게시판 리스트
                                        <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} onError={(e) => console.log('listError', e)}>
                                            <Suspense fallback={<Loading marginTop={150} />}>
                                                <BoardSelectCondition boardType={board_type} staffNo={staff_no} fCode={f_code} searchCategory={search_category} setListSearchCondition={setListSearchCondition} />
                                                <BoardTable menuType={menuType} listSearchCondition={listSearchCondition} setListSearchCondition={setListSearchCondition} />
                                            </Suspense>
                                        </ErrorBoundary>
                                }
                            </div>
                        </div>
                    </section>
                </section>
            }
        </>
    );
}

export default BoardContainer;



export type DetailInfo = { [key in BoardInfo['type']]: number } & { isDetail: boolean };