/* eslint-disable import/no-anonymous-default-export */

import { useQuery } from 'react-query';

// Hook
import { queryFn } from 'hooks/useQuery';

// Type

const useCaculateDetailList = (queryKey: string | Array<string>, fCode: number, staffNo: number, month:number, option: { [key: string]: any } = {}) => {
    
    const data = {
        ws: "fprocess",
        query: "LHXFJMM3PJSB5YVRUFLS", // web_fran_s_calculate_detail_list
        params: {
            f_code: fCode,
            std_month: '2022-10',
        },
    };

    return useQuery<any[]>(queryKey, () => queryFn.getDataOutputList(data), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: option.suspense ? option.suspense : false,
        enabled: staffNo > 0,
    });
};

// // 게시판 카테고리 가져오기
// const useCategoryList = (queryKey: string | Array<string>, boardType: BoardInfo['type'], fCode:number, staffNo: number, option: { [key: string]: any } = {}) => {

//     const data = {
//         ws: "fprocess",
//         query: "LX9H2OMNZZ3P6FOYJUOH", // web_bana_franchisee_board_code_list
//         params: {
//             nFCode: fCode,
//             grp_code: boardType * 10
//         },
//     };

//     return useQuery<Category[]>(queryKey, () => queryFn.getDataList(data), {
//         keepPreviousData: false,
//         refetchOnWindowFocus: false,
//         retry: false,
//         suspense: option.suspense ? option.suspense : true,
//         enabled: staffNo > 0,
//     });
// };


export default {
    useCaculateDetailList,
};