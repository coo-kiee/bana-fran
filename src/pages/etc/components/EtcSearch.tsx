import React from 'react';

// type
import { SearchDateType } from "types/etcType";
interface EtcSearchProps {
    from: string, // 내역 조회 시작 날짜
    to: string, // 내역 조회 끝 날짜
    updateDate: React.Dispatch<React.SetStateAction<SearchDateType>>, // 조회할 날짜 변경하는 함수
    option?: Array<string>, // 조회 필터 옵션 (발주내역, 가상계좌 페이지엔 없음)
}

// TODO: 기타내역 페이지 검색, 조회 관련 (.search-wrap 부분)
// ? react-date-picker 사용여부 (input클릭해서 month 선택지 보이게?) 
// ? from, to 데이터 유지 여부?  

const EtcSearch: React.FC<EtcSearchProps> = ({ from, to, updateDate, option }) => {
    // TODO: 
    return (
        <div className="search-wrap">
            <div className="input-wrap">
                <input type="text" placeholder="2022-03-01" defaultValue={from} />
                <i>~</i>
                <input type="text" placeholder="2022-03-30" defaultValue={to} />
            </div>
            <div className="select-wrap">
                <select name="" id="">
                    {option?.map((data, idx) => <option key={`select_wrap_${idx}`} value={data}>{data}</option>)}
                    {/* <option value="">구분 전체</option> */}
                </select>
            </div>
            <button className="btn-search">조회</button>
        </div>
    )
}

export default EtcSearch;