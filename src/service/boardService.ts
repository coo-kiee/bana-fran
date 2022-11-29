/* eslint-disable import/no-anonymous-default-export */

import { useQuery } from 'react-query';

// Hook
import { queryFn } from 'hooks/useQuery';

// Type
import { BoardListResult, BoardInfo, Category, BoardDetailType, FileType } from 'types/board/boardType';

// 게시판 카테고리 가져오기
const useCategoryList = (queryKey: string | Array<string>, boardType: BoardInfo['type'], fCode:number, staffNo: number, option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "LX9H2OMNZZ3P6FOYJUOH", // web_bana_franchisee_board_code_list
        params: {
            nFCode: fCode,
            grp_code: boardType * 10
        },
    };

    return useQuery<Category[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : false,
        enabled: staffNo > 0,
    });
};

// 게시판 목록 가져오기
type BoardListParams = {
    f_code: number, // 가맹지점 코드
    staff_no: number, // 직원번호
    board_type: BoardInfo['type'], // 1 : 공지사항, 2 : 운영 매뉴얼, 3 : 교육자료실, 4 : 레시피자료실, 5 : 규정 및 가이드, 6 : 정산관련 공지 )
    search_category: number, // 게시판 별카테고리 0 : 전체, 1 : 메뉴얼, 2: 규정...
    search_text: string, // 검색 키워드
    page_idx: number, // 조회할 페이지
    page_size: number, // 조회할 건수
};
const useBoardList = (queryKey: string | Array<string>, params: BoardListParams, option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "D6MYCRZIGBVCL9AAULSD", // web_fran_s_board_list
        params,
    };

    return useQuery<BoardListResult>(queryKey, () => queryFn.getDataOutputList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: params.staff_no > 0,
    });
};

// 게시판 상세보기
const useBoard = (queryKey: string | Array<string>, boardId: number, staffNo: number, fCode: number, option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "UMBVZRVADKA13KGG9YBF", // web_fran_s_board_select
        params: {
            f_code: fCode,
            staff_no: staffNo,
            board_id: boardId,
        },
    };

    return useQuery<BoardDetailType>(queryKey, () => queryFn.getData(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0 && boardId > 0,
    });
};

// 게시판 상세 내용 가져오기
const useBoardContent = (queryKey: string | Array<string>, url: string) => {
    
    return useQuery<string>(queryKey, () => queryFn.axiosGet(url), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
    })
};

// 게시판 상세 파일첨부
const useBoardAttachList = (queryKey: string | Array<string>, boardId: number, option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "HX0FUMTRIQP1THBAON9J", // web_fran_s_board_attach_list
        params: {
            board_id: boardId,
        },
    };

    return useQuery<FileType[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
    });
};

export default {
    useCategoryList,
    useBoardList,
    useBoard,
    useBoardContent,
    useBoardAttachList,
};