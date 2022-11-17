import { useQuery, UseQueryResult } from 'react-query'
import { queryFn } from 'hooks/useQuery'
import { AxiosError } from 'axios';
import { format, subMonths } from 'date-fns';

// type
import { RequestParams } from 'types/dataType';
import { EtcTotalParams, EtcListParams, OrderDetailModalParams, OrderDetailModalItemType } from 'types/etc/etcType';

// TODO: 수수료 내역 (*_total 프로시저 공통 함수)
const useEtcTotal = <T extends EtcTotalParams, U>(query: string, params: T, queryKey: string, selectFn?: any): UseQueryResult<U, AxiosError<unknown, any>> => {
    // paramType, resultType, query, params, queryKey
    const reqData: RequestParams<T> = { ws: 'fprocess', query, params };
    return useQuery<U, AxiosError>([queryKey, params.fran_store], () => queryFn.getData(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        },
        select: (data: any) => {
            return !!selectFn ? selectFn(data) : data
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
        },
    });
};

const useOrderDetailStatistic = (params: EtcTotalParams) => {
    const reqData: RequestParams<EtcTotalParams> = {
        ws: 'fprocess', query: '2Q65LKD2JBSZ3OWKWTWY', params
    };

    return useQuery(['etc_order_detail_statistic', params.fran_store], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        },
        select: (data: any) => {
            let previousMonths: { [key: string]: any }[] = [];
            Array.from({ length: 10 }, (_, idx1) => idx1).forEach((el, idx2) => {
                const month = format(subMonths(new Date(), el), 'yyyy-MM');
                previousMonths[idx2] = { date_monthly: month, amount: 0 }
            }); // previousMonths = [ {date_monthly: '2022-11', amount: 0}, ...,  {date_monthly: '2022-01', amount: 0}], 최근을 앞에 오게

            data.map((el: any, idx: number) => {
                previousMonths[idx] = { ...previousMonths[idx], amount: el.amount }
            }); // 내림차순이라 idx 그대로 사용 가능

            return previousMonths.reverse(); // 순서 뒤집어주고 정리
        }
    });
}

const useOrderDetailModal = (params: OrderDetailModalParams) => {
    const reqData: RequestParams<OrderDetailModalParams> = { ws: 'fprocess', query: 'R7UCMHCQJ7DPFZXTVPRP', params };

    return useQuery<Array<OrderDetailModalItemType>, AxiosError>(['etc_order_detail_modal', params.order_code], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
    });
}

const ETC_SERVICE = {
    useEtcTotal,
    useEtcList,
    useOrderDetailStatistic,
    useOrderDetailModal,
};

export default ETC_SERVICE;