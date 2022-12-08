/* eslint-disable import/no-anonymous-default-export */

import { useQuery } from 'react-query';

// Hook
import { queryFn } from 'hooks/useQuery';

// Type
import { BoardListQueryResult, BoardInfo, BoardCategoryListQueryResult, BoardDetailQueryResult, BoardAttachListQueryResult, BoardListQueryParams } from 'types/board/boardType';

// 게시판 카테고리 가져오기
const useBoardCategoryList = (boardType: BoardInfo['type'], fCode:number, staffNo: number, option: { [key: string]: any } = {}) => {

    const queryKey = [BOARD_QUERY_KEY.BOARD_CATEGORY_LIST, boardType, staffNo];
    const data = {
        ws: "fprocess",
        query: "LX9H2OMNZZ3P6FOYJUOH", // web_bana_franchisee_board_code_list
        params: {
            nFCode: fCode,
            grp_code: boardType * 10
        },
    };

    return useQuery<BoardCategoryListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : false,
        enabled: staffNo > 0,
    });
};

// 게시판 목록 가져오기
const useBoardList = (params: BoardListQueryParams, option: { [key: string]: any } = {}) => {

    const queryKey = [BOARD_QUERY_KEY.BOARD_LIST, ...Object.values(params)];
    const data = {
        ws: "fprocess",
        query: "D6MYCRZIGBVCL9AAULSD", // web_fran_s_board_list
        params,
    };

    return useQuery<BoardListQueryResult>(queryKey, () => queryFn.getDataOutputList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: params.staff_no > 0,
    });
};

// 게시판 상세보기
const useBoardDetail = (boardId: number, staffNo: number, fCode: number, option: { [key: string]: any } = {}) => {

    const queryKey = [BOARD_QUERY_KEY.BOARD_DETAIL, boardId, staffNo, fCode];
    const data = {
        ws: "fprocess",
        query: "UMBVZRVADKA13KGG9YBF", // web_fran_s_board_select
        params: {
            f_code: fCode,
            staff_no: staffNo,
            board_id: boardId,
        },
    };

    return useQuery<BoardDetailQueryResult>(queryKey, () => queryFn.getData(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0 && boardId > 0,
    });
};

// 게시판 상세 내용 가져오기
const useBoardContent = (url: string) => {
    
    const queryKey = [BOARD_QUERY_KEY.BOARD_CONTENT, url];

    return useQuery<string>(queryKey, () => queryFn.axiosGet(url), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
    })
};

// 게시판 상세 파일첨부
const useBoardAttachList = (boardId: number, option: { [key: string]: any } = {}) => {

    const queryKey = [BOARD_QUERY_KEY.BOARD_ATTACH_LIST, boardId.toString()];
    const data = {
        ws: "fprocess",
        query: "HX0FUMTRIQP1THBAON9J", // web_fran_s_board_attach_list
        params: {
            board_id: boardId,
        },
    };

    return useQuery<BoardAttachListQueryResult[]>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : true,
    });
};

export default {
    useBoardCategoryList,
    useBoardList,
    useBoardDetail,
    useBoardContent,
    useBoardAttachList,
};

export const BOARD_QUERY_KEY = {
    BOARD_CATEGORY_LIST:'boardCategoryList',
    BOARD_LIST:'boardList',
    BOARD_DETAIL:'boardDetail',
    BOARD_CONTENT:'boardContent',
    BOARD_ATTACH_LIST:'boardAttachList',
} as const;