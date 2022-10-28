/* eslint-disable */

import { useQuery } from 'react-query';

// Hook
import { queryFn } from 'hooks/useQuery';

// Type
import { BoardListResult, BoardType, Category, ListSearchCondition } from 'types/board/boardType';
import { Type } from 'typescript';

// 게시판 카테고리 가져오기
const getCategoryList = (queryKey: string | Array<string>, boardType: BoardType['type'], option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "LX9H2OMNZZ3P6FOYJUOH",
        params: {
            nFCode: 0,
            grp_code: boardType * 10
        },
    };

    return useQuery<any, unknown, Category[], string | Array<string>>(queryKey, () => queryFn.getDataList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : false,
    });
};


// 게시판 목록 가져오기
const getBoardList = (queryKey: string | Array<string>, params: ListSearchCondition, option: { [key: string]: any } = {}) => {

    const data = {
        ws: "fprocess",
        query: "D6MYCRZIGBVCL9AAULSD",
        params,
    };

    return useQuery<any, unknown, BoardListResult, string | Array<string>>(queryKey, () => queryFn.getDataOutputList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : false,
    });
};


const BOARD_SERVICE = {
    getCategoryList,
    getBoardList,
};

export default BOARD_SERVICE;