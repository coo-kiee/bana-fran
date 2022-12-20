// Polyfill
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientConfig, QueryClientProvider } from 'react-query';

import { ReactQueryDevtools } from 'react-query/devtools';
import { AxiosError } from 'axios';

const defalutQueryOption: QueryClientConfig = {
    defaultOptions: {
        queries: {
            onError(error) {
                const axiosError = error as AxiosError;
                console.log('defaultError', error);

                const queryCaches = queryClient.getQueryCache().getAll();
                const isFirstLoginError = queryCaches.filter(query => query.state.error && (query.state.error as AxiosError).response?.status === 600 && ((query.state.error as AxiosError).response?.data as string).includes('로그인')).length === 1;
                
                // 첫 로그인 에러인 경우
                if (isFirstLoginError) {
                    window.location.replace('/index');
                    alert("세션이 만료 되었습니다.");
                } else if (!!axiosError?.response?.data && !(axiosError?.response?.data as string).includes('로그인')) {
                    alert("[ERROR_" + axiosError.response?.status + "]" + axiosError?.response?.data);
                };
            }
        }
    }
};

const queryClient = new QueryClient(defalutQueryOption);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <RecoilRoot>
        <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
    </RecoilRoot>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
