import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// style
import 'react-datepicker/dist/react-datepicker.css';

// Type
import { SearchInfoType } from 'types/etc/etcType';
interface CalanderSearchItemProps {
    date: string,
    dateType: string,
    updateDate: (date: any) => void, // 조회할 날짜 변경하는 함수
}
interface CalanderSearchProps {
    title: string, // 제목
    searchInfo: SearchInfoType, // 검색 관련 옵션, 날짜 state
    updateSearchInfo: React.Dispatch<React.SetStateAction<SearchInfoType>>, // setState
    dateType: string, // 날짜 형식 ... ex) yyyy-MM-dd
    option?: string[][], // select로 나타날 옵션
    handleSearch: () => void, // 쿼리 검색 기능
}

const SearchCalanderItem: React.FC<CalanderSearchItemProps> = ({ date, dateType, updateDate }) => {
    return (
        <DatePicker
            selected={new Date(date)}
            value={date}
            locale={ko}
            dateFormat={dateType}
            onChange={(date) => updateDate(date)}
        />
    )
}

const CalanderSearch: React.FC<CalanderSearchProps> = ({ title, searchInfo, updateSearchInfo, dateType, option, handleSearch }) => {
    const { from, to, searchOption } = searchInfo;

    // TODO: searchInfo.searchOption 변경
    const handleSearchOption = (e: React.ChangeEvent<HTMLSelectElement>, idx: number) => {
        const tempOption = [...searchOption as string[]];
        tempOption[idx] = e.target.value;
        return updateSearchInfo((prev) => {
            return { ...prev, searchOption: tempOption }
        })
    };

    return (
        <>
            <p className="title bullet">{title}</p>
            <div className="search-wrap">
                <div className="input-wrap">
                    <SearchCalanderItem date={from} dateType={dateType} updateDate={(date) => updateSearchInfo(prev => ({ ...prev, from: format(date!, dateType) }))} />
                    <i>~</i>
                    <SearchCalanderItem date={to} dateType={dateType} updateDate={(date) => updateSearchInfo(prev => ({ ...prev, to: format(date!, dateType) }))} />
                </div>
                {searchOption && option && <div className="select-wrap"> {/* select 옵션값과 관련된 state가 있고, option이 들어온 경우에만 나타남 */}
                    {option.map((selectData, idx1) => {
                        {/* #1: select 만들기 */ }
                        return (
                            <select key={`select_${idx1}`} name="" id="" value={searchOption[idx1]} onChange={(e) => handleSearchOption(e, idx1)}>
                                {selectData.map((optionData, idx2) => {
                                    {/* #2: option 만들기 */ }
                                    return (
                                        <option key={`option_${idx1}_${idx2}`} value={optionData}>{optionData}</option>
                                    )
                                })}
                            </select>
                        )
                    })}
                </div>}
                <button className="btn-search" onClick={handleSearch}>조회</button>
            </div>
        </>
    )
}

export default CalanderSearch