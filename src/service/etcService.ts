import { useQuery, UseQueryResult } from 'react-query'
import { queryFn } from 'hooks/useQuery'
import { AxiosError } from 'axios';

// type
import { RequestParams } from 'types/dataType';
import { EtcTotalParams, EtcListParams, TotalResultType } from 'types/etc/etcType';

// TODO: 수수료 내역 (*_total 프로시저 공통 함수)
const useEtcTotal = <T extends EtcTotalParams, U>(query: string, params: T, queryKey: string): UseQueryResult<U, AxiosError<unknown, any>> => {
    // paramType, resultType, query, params, queryKey
    const reqData: RequestParams<T> = { ws: 'fprocess', query, params };
    return useQuery<U, AxiosError>([queryKey, params.fran_store], () => queryFn.getData(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        }
    });
};

// TODO: 상세 내역 (*_list 프로시저 공통 함수)
const useEtcList = <T extends EtcListParams>(query: string, params: T, queryKey: string): UseQueryResult<any, AxiosError<unknown, any>> => {
    const reqData: RequestParams<T> = { ws: 'fprocess', query, params };
    return useQuery([queryKey, params.from_date, params.to_date, params.fran_store], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        }
    });
};

export {
    useEtcTotal,
    useEtcList,
};