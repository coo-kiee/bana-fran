/* eslint-disable import/no-anonymous-default-export */
import { useMutation } from 'react-query'
import { queryFn } from 'hooks/useQuery'
// import { Modal } from 'common/modal'
// import { CAR_TYPE, TruckOptionInfo, TRUCK_TYPE_LIST } from 'types/orderType'
// import { CarChargeSearchParams } from 'types/common'
// import Utils from 'utils/Utils';


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
    useLogin,
    useLogout
}
