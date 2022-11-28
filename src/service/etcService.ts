import { useQuery, UseQueryResult } from 'react-query'
import { queryFn } from 'hooks/useQuery'
import { AxiosError } from 'axios';
import { format, subMonths } from 'date-fns';

// type
import { RequestParams } from 'types/common';
import { EtcTotalParams, EtcListParams, OrderDetailModalParams, OrderDetailModalItemType, ChkGiftCardStockParams, GiftCardListParams } from 'types/etc/etcType';
import Utils from 'utils/Utils';

// TODO: 수수료 내역 (*_total 프로시저 공통 함수)
const useEtcTotal = <T extends EtcTotalParams, U>(query: string, params: T, queryKey: string, option: { [key: string]: any } = {}): UseQueryResult<U, AxiosError<unknown, any>> => {
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
    });
};

// TODO: 상세 내역 (*_list 프로시저 공통 함수)
const useEtcList = <T extends EtcListParams, U>(query: string, params: T, queryKey: string, option: { [key: string]: any } = {}): UseQueryResult<U, AxiosError<unknown, any>> => {
    const reqData: RequestParams<T> = { ws: 'fprocess', query, params };
    return useQuery<U, AxiosError>([queryKey, params.from_date, params.to_date, params.fran_store], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        // suspense: true, 
        suspense: false, 
        onError: (err: any) => {
            queryFn.axiosError(err);
        },
    });
};

const useChkGiftCardStock = (params: ChkGiftCardStockParams) => {
    const reqData: RequestParams<ChkGiftCardStockParams> = { ws: 'fprocess', query:'U1UQFUQ3JVHCLULFASVU', params};
    return useQuery<any, AxiosError>(['etc_gift_card_stock', params.f_code], () => queryFn.getData(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,  
        onError: (err: any) => {
            queryFn.axiosError(err);
        },
        select: (data: any) => {
            return {
                fran_stock_cnt1: Utils.numberComma(data.fran_stock_cnt1),
                fran_stock_amt1: Utils.numberComma(data.fran_stock_amt1),
                fran_stock_cnt3: Utils.numberComma(data.fran_stock_cnt3),
                fran_stock_amt3: Utils.numberComma(data.fran_stock_amt3),
                fran_stock_cnt5: Utils.numberComma(data.fran_stock_cnt5),
                fran_stock_amt5: Utils.numberComma(data.fran_stock_amt5),
                hq_stock_cnt1 : Utils.numberComma(data.hq_stock_cnt1),
                hq_stock_amt1 : Utils.numberComma(data.hq_stock_amt1),     
                hq_stock_cnt3: Utils.numberComma(data.hq_stock_cnt3),      
                hq_stock_amt3: Utils.numberComma(data.hq_stock_amt3),
                hq_stock_cnt5: Utils.numberComma(data.hq_stock_cnt5),
                hq_stock_amt5: Utils.numberComma(data.hq_stock_amt5), 
                fran_stock_cnt_total: Utils.numberComma(data.fran_stock_cnt1 + data.fran_stock_cnt3 + data.fran_stock_cnt5 ),
                fran_stock_amt_total: Utils.numberComma(data.fran_stock_amt1 + data.fran_stock_amt3 + data.fran_stock_amt5 ),
                hq_stock_cnt_total: Utils.numberComma(data.hq_stock_cnt1 + data.hq_stock_cnt3 + data.hq_stock_cnt5 ),
                hq_stock_amt_total: Utils.numberComma(data.hq_stock_amt1 + data.hq_stock_amt3 + data.hq_stock_amt5 ),
                cnt1_class: data.fran_stock_cnt1 !== data.hq_stock_cnt1 ? 'negative-value' : '', 
                cnt3_class: data.fran_stock_cnt3 !== data.hq_stock_cnt3 ? 'negative-value' : '',
                cnt5_class: data.fran_stock_cnt3 !== data.hq_stock_cnt5 ? 'negative-value' : '', 
                total_class:
                    (data.fran_stock_cnt1 + data.fran_stock_cnt3 + data.fran_stock_cnt5) !== (data.hq_stock_cnt1 + data.hq_stock_cnt3 + data.hq_stock_cnt5) // 갯수가 다르거나
                || 
                    (data.fran_stock_amt1 + data.fran_stock_amt3 + data.fran_stock_amt5) !== (data.hq_stock_amt1 + data.hq_stock_amt3 + data.hq_stock_amt5) // 가격이 다른경우
                    ? 'negative-value' : ''
            };
        }
    });
} // web_fran_s_etc_gift_cert_stock

const useGiftCardList = (params: GiftCardListParams) => {
    const reqData: RequestParams<GiftCardListParams> = { ws: 'fprocess', query:'B2XZPTGEAIHS14XICOKT', params};
    return useQuery<any, AxiosError>(['etc_gift_card_list', params.f_code], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,  
        onError: (err: any) => {
            queryFn.axiosError(err);
        },
    });
} // web_fran_s_etc_gift_cert_detail_list

const useMusicTotal = (params: EtcTotalParams) => {
    const reqData: RequestParams<EtcTotalParams> = { ws: 'fprocess', query: '8WDCFLDHSNA7WRN9JCBS', params };
    return useQuery<any, AxiosError>(['etc_music_fee', params.fran_store], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        suspense: true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        },
    });
};

const useOrderDetailStatistic = (params: EtcTotalParams, option: { [key: string]: any } = {}) => {
    const reqData: RequestParams<EtcTotalParams> = {
        ws: 'fprocess', query: '2Q65LKD2JBSZ3OWKWTWY', params
    };

    return useQuery(['etc_order_detail_statistic', params.fran_store], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        // suspense: false,
        suspense: !!option.suspense ? option.suspense : true,
        onError: (err: any) => {
            queryFn.axiosError(err);
        },
        select: (data: any) => {
            let previousMonths: { [key: string]: any }[] = [];
            Array.from({ length: 10 }, (_, idx1) => idx1).forEach((el, idx2) => {
                const month = format(subMonths(new Date(), el), 'yyyy-MM');
                previousMonths[idx2] = { date_monthly: month, amount: 0 }
            }); // previousMonths = [ {date_monthly: '2022-11', amount: 0}, ...,  {date_monthly: '2022-01', amount: 0}], 최근을 앞에 오게

            data.forEach((el: any, idx: number) => {
                previousMonths[idx] = { ...previousMonths[idx], amount: el.amount }
            }); // 내림차순이라 idx 그대로 사용 가능

            return previousMonths.reverse(); // 순서 뒤집어주고 정리  
        },
    });
}

const useOrderDetailModal = (params: OrderDetailModalParams) => {
    const reqData: RequestParams<OrderDetailModalParams> = { ws: 'fprocess', query: 'R7UCMHCQJ7DPFZXTVPRP', params };

    return useQuery<Array<OrderDetailModalItemType>, AxiosError>(['etc_order_detail_modal', params.order_code], () => queryFn.getDataList(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        // suspense: true,
    });
}

const ETC_SERVICE = {
    useEtcTotal,
    useEtcList,
    useMusicTotal,
    useChkGiftCardStock,
    useGiftCardList,
    useOrderDetailStatistic, 
    useOrderDetailModal,
};

export default ETC_SERVICE;