import { FC, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate, useParams } from "react-router-dom";
import loadable from "@loadable/component";

// Type
import { BoardInfo, BOARD_GROUP, MenuType, MENU_TYPE } from "types/board/boardType";

// state
import { useRecoilValue } from "recoil";
import { franState, loginState } from "state";

// Util
import Utils from "utils/Utils";

// Component
import BoardTab from "./component/BoardTab";
import BoardSearchCondition from "./component/BoardSearchCondition";
import BoardTable from "./component/BoardTable";
import BoardHeader from "./component/BoardHeader";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

const Loading = loadable(() => import('pages/common/loading'));
const BoardDetail = loadable(() => import('pages/board/component/detail/BoardDetail'));

const BoardContainer: FC<{ menuType: MenuType }> = ({ menuType = MENU_TYPE.BOARD }) => {

    const { bType, bId } = useParams();
    const boardType = Number(bType) as BoardInfo['type'];
    // 숫자이고, 현재 게시판 탭 그룹에 속해 있을때
    const isBoardGroupType =  Utils.isNumber(bType) && Object.values(BOARD_GROUP[menuType]).filter((boardInfo) => boardInfo.type === boardType).length > 0;
    const isBoardId = Utils.isNumber(bId) &&  Number(bId) > 0;
    
    // Redirect
    const navigation = useNavigate();
    useEffect(() => {
        if (bType !== undefined && !isBoardGroupType) navigation(-1);
        if (bId !== undefined && !isBoardId) navigation(-1);
    }, [bType, bId, isBoardGroupType, isBoardId, navigation]);

    // 게시판 탭 변경 & 게시판 상세 이동
    useLayoutEffect(() => {

        if (!boardType) { // 페이지 처음 로딩 시
            setListSearchParameter(prev => ({ ...prev, board_type: BOARD_GROUP[menuType][0].type })); // 게시판 첫번째 탭 type 입력
            setDetailInfo(prev => ({ ...prev, isDetail: false }));
        }
        else if (isBoardGroupType && isBoardId) { // 게시판 상세이동
            setListSearchParameter(prev => ({ ...prev, board_type: boardType }));
            setDetailInfo(prev => ({ ...prev, [boardType]: Number(bId), isDetail: true }));
        }
        else if (isBoardGroupType) { // 게시판 탭 변경
            setListSearchParameter(prev => ({ ...prev, board_type: boardType }));
            setDetailInfo(prev => ({ ...prev, isDetail: false }));
        }
    }, [menuType, boardType, bId, isBoardGroupType, isBoardId]);

    const { userInfo } = useRecoilValue(loginState);
    const fCode = useRecoilValue(franState);
    useEffect(() => { // 유저정보, 가맹점 코드 변경 시 listSearchParameter 갱신
        setListSearchParameter(prev => ({ ...prev, f_code: fCode, staff_no: userInfo.staff_no }));
    }, [fCode, userInfo]);

    // 리스트 검색 정보
    const [initialSearchCategory, initialSearchText] = Object.values(BOARD_GROUP[menuType]).reduce((arr, cur) => {
        arr[0][cur.type] = 0;
        arr[1][cur.type] = '';
        return arr;
    }, [{}, {}] as [ListSearchParameter['search_category'], ListSearchParameter['search_text']]);
    
    // 리스트 조회에 필요한 파라미터
    const [listSearchParameter, setListSearchParameter] = useState<ListSearchParameter>({
        f_code: fCode,
        staff_no: userInfo.staff_no,
        board_type: BOARD_GROUP[menuType][0].type,
        search_category: initialSearchCategory,
        search_text: initialSearchText,
        page_idx: 1,
        page_size: 20,
    });

    const { board_type, search_category, search_text, staff_no, f_code } = listSearchParameter;
    
    // 상세보기 정보 - 현재 메뉴 boardType들의 boardId + isDetail
    const initialDetail: DetailInfo = Object.values(BOARD_GROUP[menuType]).reduce((detailObj, boardInfo: BoardInfo) => {
        const res = { ...detailObj, [boardInfo.type]: 0 };
        return res;
    }, { isDetail: false });
    const [detailInfo, setDetailInfo] = useState(initialDetail);
    const { isDetail, [board_type]: boardId } = detailInfo;

    return (
        <>
            {
                (isBoardGroupType || bType === undefined) && (isBoardId || bId === undefined) &&
                <section className="container">
                    <BoardHeader menuType={menuType} />
                    <section className={`contents-wrap ${isDetail ? `notice-view-wrap` : 'notice-wrap'}`}>
                        <div className="contents">
                            <BoardTab menuType={menuType} boardType={board_type} detailInfo={detailInfo} />
                            <div id="tab1" className="tab-content active">
                                {
                                    isDetail ?
                                        // 게시판 상세
                                        <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} onError={(e) => console.log('detailError', e)}>
                                            <Suspense fallback={<Loading marginTop={300} />}>
                                                <BoardDetail menuType={menuType} boardId={boardId} staffNo={staff_no} fCode={f_code} setDetailInfo={setDetailInfo} />
                                            </Suspense>
                                        </ErrorBoundary>
                                        :
                                        // 게시판 리스트
                                        <>
                                            <BoardSearchCondition boardType={board_type} staffNo={staff_no} fCode={f_code} searchCategory={search_category} searchText={search_text} setListSearchParameter={setListSearchParameter} />
                                            <BoardTable menuType={menuType} listSearchParameter={listSearchParameter} setListSearchParameter={setListSearchParameter} />
                                        </>
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



// Component Type
export interface ListSearchParameter {
    f_code: number, // 가맹지점 코드
    staff_no: number, // 직원번호
    board_type: BoardInfo['type'], // 1 : 공지사항, 2 : 운영 매뉴얼, 3 : 교육자료실, 4 : 레시피자료실, 5 : 규정 및 가이드, 6 : 정산관련 공지 )
    search_category: { [key in BoardInfo['type']]: number }, // 게시판 별카테고리 0 : 전체, 1 : 메뉴얼, 2: 규정...
    search_text: { [key in BoardInfo['type']]: string }, // 검색 키워드
    page_idx: number, // 조회할 페이지
    page_size: number, // 조회할 건수
};
export type DetailInfo = { [key in BoardInfo['type']]: number } & { isDetail: boolean };