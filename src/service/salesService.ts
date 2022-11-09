/* eslint-disable import/no-anonymous-default-export */
import { useQuery } from 'react-query'
import { queryFn } from 'hooks/useQuery'

interface Params extends Object {
    [key: string]: any,

}

// 주문 내역 조회
const useSalesOrderList = (params: Params) => {
    const reqData = {
        ws: 'fprocess',
        query: 'KTBKHHVNSBCJHXUADDII',
        params: params,
    }; // web_fran_s_sales_order_list
    return useQuery(['sales_order_list', params.f_code, params.from_date, params.to_date], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        onError : (err:any) => {
            queryFn.axiosError(err);
        }
    });
};

// 매출 통계 조회
const useSalesStatistic = (params: Params) => {
    const reqData = {
        ws: 'fprocess',
        query: 'M2AWHBEO7CTAJMF2B1AW',
        params: params,
    }; // web_fran_s_sales_stat_list
    return useQuery(['sales_statistic_list', params.f_code, params.search_type, params.from_date, params.to_date], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        onError : (err:any) => {
            queryFn.axiosError(err);
        }
    });
};

export default {
    useSalesOrderList,
    useSalesStatistic,
}