import { FC, Suspense, useLayoutEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import loadable from "@loadable/component";

// Css
import 'assets/sass/notice.scss';

// Type
import { BoardInfo, BOARD_GROUP, ListSearchCondition, MenuType, MENU_TYPE } from "types/board/boardType";

// state
import { useRecoilValue } from "recoil";
import { loginState } from "state";

// component
import BoardTab from "./component/BoardTab";
import BoardSelectCondition from "./component/BoardSelectCondition";
import BoardTable from "./component/BoardTable";
import BoardHeader from "./component/BoardHeader";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";

const Loading = loadable(() => import('pages/common/loading'));
const BoardDetail = loadable(() => import('pages/board/component/detail/BoardDetail'));

const BoardContainer: FC<{ menuType?: MenuType }> = ({ menuType = MENU_TYPE.ARCHAIVE }) => {

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

    // Tab 이동시 Detail 정보 있으면 Detail 보여주기
    useLayoutEffect(() => {
        if (!!detailInfo[board_type]) setDetailInfo(prev => ({ ...prev, isDetail: true }));
        else setDetailInfo(prev => ({ ...prev, isDetail: false }));
    }, [board_type]);

    return (
        <section className="container">
            <BoardHeader menuType={menuType} />
            <section className={`contents-wrap ${isDetail ? 'notice-view-wrap' : 'notice-wrap'}`}>
                <div className="contents">
                    <BoardTab menuType={menuType} boardType={board_type} setListSearchCondition={setListSearchCondition} />
                    <div id="tab1" className="tab-content active">
                        {
                            isDetail ?
                                // 게시판 상세
                                <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} onError={(e) => console.log('detailError', e)}>
                                    <Suspense fallback={<Loading marginTop={100} />}>
                                        <BoardDetail boardId={boardId} staffNo={staff_no} fCode={f_code} setDetailInfo={setDetailInfo} />
                                    </Suspense>
                                </ErrorBoundary>
                                :
                                // 게시판 리스트
                                <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} onError={(e) => console.log('listError', e)}>
                                    <Suspense fallback={<Loading marginTop={150} />}>
                                        <BoardSelectCondition boardType={board_type} staffNo={staff_no} fCode={f_code} searchCategory={search_category} setListSearchCondition={setListSearchCondition} />
                                        <BoardTable listSearchCondition={listSearchCondition} setListSearchCondition={setListSearchCondition} setDetailInfo={setDetailInfo} />
                                    </Suspense>
                                </ErrorBoundary>
                        }
                    </div>
                </div>
            </section>
        </section>
    );
}

export default BoardContainer;



export type DetailInfo = { [key in BoardInfo['type']]: number } & { isDetail: boolean };

const ErrorFallbackRender = () => {

    return (
        <button>재시도</button>
    )
}