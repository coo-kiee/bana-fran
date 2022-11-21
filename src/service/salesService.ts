/* eslint-disable import/no-anonymous-default-export */
import { useQuery } from 'react-query'
import { queryFn } from 'hooks/useQuery'
import { RequestParams } from 'types/common';
import { SalesOrderParams, SalesStatisticParams } from 'types/sales/salesType';

// 주문 내역 조회
const useSalesOrderList = (params: SalesOrderParams) => {
    const reqData: RequestParams<SalesOrderParams> = {
        ws: 'fprocess',
        query: 'KTBKHHVNSBCJHXUADDII',
        params: params,
    }; // web_fran_s_sales_order_list
    return useQuery(['sales_order_list', params.f_code], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        // suspense: true,
        onError : (err:any) => {
            queryFn.axiosError(err);
        }
    });
};

// 매출 통계 조회
const useSalesStatistic = (params: SalesStatisticParams) => {
    const reqData: RequestParams<SalesStatisticParams> = {
        ws: 'fprocess',
        query: 'M2AWHBEO7CTAJMF2B1AW',
        params: params,
    }; // web_fran_s_sales_stat_list
    return useQuery(['sales_statistic_list', params.f_code], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        // suspense: true,
        onError : (err:any) => {
            queryFn.axiosError(err);
        }
    });
};

export default {
    useSalesOrderList,
    useSalesStatistic,
}