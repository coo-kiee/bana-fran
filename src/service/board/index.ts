/* eslint-disable */

import { useQuery } from 'react-query';

// Hook
import { queryFn } from 'hooks/useQuery';

// Type
import { BoardListResult, BoardInfo, Category, ListSearchCondition, BoardDetailType, FileType } from 'types/board/boardType';

// 게시판 카테고리 가져오기
const getCategoryList = (queryKey: string | Array<string>, boardType: BoardInfo['type'], fCode:number, staffNo: number, option: { [key: string]: any } = {}) => {

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
        suspense: option.suspense ? option.suspense : true,
        enabled: staffNo > 0,
    });
};

// 게시판 목록 가져오기
const getBoardList = (queryKey: string | Array<string>, params: ListSearchCondition, option: { [key: string]: any } = {}) => {

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
const getBoard = (queryKey: string | Array<string>, boardId: number, staffNo: number, fCode: number, option: { [key: string]: any } = {}) => {

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
        enabled: staffNo > 0,
    });
};

// 게시판 상세 내용 가져오기
const getContent = (queryKey: string | Array<string>, url: string) => {
    
    return useQuery<string>(queryKey, () => queryFn.axiosGet(url), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
    })
};

// 게시판 상세 파일첨부
const getBoardAttachList = (queryKey: string | Array<string>, boardId: number, option: { [key: string]: any } = {}) => {

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

const BOARD_SERVICE = {
    getCategoryList,
    getBoardList,
    getBoard,
    getContent,
    getBoardAttachList,
};

export default BOARD_SERVICE;