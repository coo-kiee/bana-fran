/* eslint-disable import/no-anonymous-default-export */
import { useMutation } from 'react-query'
import { queryFn } from 'hooks/useQuery'

// 비밀번호 변경
const useSaveChangePassword = (onError: any, onSuccess: any) => {
    const fetch = (params: Object) => {
        const reqData = {
            ws: 'fprocess',
            query: '8UUXS3MC6VIILPYJRKAL',
            params: params,
        } // web_fran_s_change_password_update
        return queryFn.getDataOutput(reqData)
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

// 비밀번호 변경 인증 문자발송.
const useSendPasswordAuthSMS = (onError: any, onSuccess: any) => {
    const fetch = (params: Object) => {
        const reqData = {
            ws: 'fprocess',
            query: 'FZFCWLUYG0Q8HGMIT2YP',
            params: params,
        } // web_fran_s_send_pw_auth_key_sms
        return queryFn.getDataOutput(reqData)
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
    useSaveChangePassword,
    useSendPasswordAuthSMS
}
