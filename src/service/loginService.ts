/* eslint-disable import/no-anonymous-default-export */
import { useMutation, useQuery } from 'react-query'
import { queryFn } from 'hooks/useQuery'

// 인증 문자 발송.
const useSendAuthKey = (params: Object) => {
    const reqData = { 
        ws: "fprocess", 
        query: "LTW78NBLVBJPKYW6PMVF", 
        params: params
    } // web_fran_s_send_auth_key_sms
    return useQuery('web_fran_s_send_auth_key_sms', () => queryFn.getDataOutput(reqData), {
        keepPreviousData: false,
        refetchOnWindowFocus: false,
        retry: false,
        cacheTime : Infinity,
        onError : (err:any) => {
            alert(`문자발송에 실패하였습니다. ${err.response.data}`);
        }
    })
}

// 인증 로그인.
const useAuthLogin = (onError: any, onSuccess: any) => {
    const fetch = (params: Object) => {
        const reqData = {
            ws: 'fprocess',
            query: 'PBVKS7TZCYYSAUJXDVZD',
            params: params,
        } // web_fran_s_process_auth_login_manager_add_token
        return queryFn.fetchLogin(reqData)
    }

    return useMutation((params: Object) => fetch(params), {
        onError: (err:any) => {
             if(onError) onError(err.response) 
        },
        onSuccess(data, variables) {
            if(onSuccess) onSuccess(data, variables) 
        }
    })
}

// 로그인
const useLogin = (onError: any, onSuccess: any) => {
    const fetch = (params: Object) => {
        const reqData = {
            ws: 'fprocess',
            query: 'Q3KFUZHJVCEPZD76D0Y3',
            params: params,
        } // web_fran_s_process_login_manager_add_token
        return queryFn.fetchLogin(reqData)
    }

    return useMutation((params: Object) => fetch(params), {
        onError: (err:any) => {
             if(onError) onError(err.response) 
        },
        onSuccess(data, variables) {
            if(onSuccess) onSuccess(data, variables) 
        }
    })
}

// 로그아웃.
const useLogout = (onError: any, onSuccess: any) => {
    const fetch = (params: Object) => {
        const reqData = {
            ws: 'fprocess',
            query: 'Q3KFUZHJVCEPZD76D0Y3',
            params: params,
        } // web_fran_s_process_login_manager_add_token
        return queryFn.fetchLogin(reqData)
    }

    return useMutation((params: Object) => fetch(params), {
        onError: (err:any) => {
             if(onError) onError(err.response) 
        },
        onSuccess(data, variables) {
            if(onSuccess) onSuccess(data, variables) 
        }
    })
}

export default {
    useSendAuthKey,
    useAuthLogin,
    useLogin,
    useLogout
}
