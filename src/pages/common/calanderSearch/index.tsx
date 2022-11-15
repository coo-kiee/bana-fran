import { Fragment } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';

// style
import 'react-datepicker/dist/react-datepicker.css';

// Type
import { SearchInfoType, SearchInfoSelectType, SearchInfoRadioType, isSelect, isRadio } from 'types/etc/etcType';

interface CalanderSearchProps {
    title?: string, // 제목
    dateType: string, // 날짜 형식 ... ex) yyyy-MM-dd  
    searchInfo: SearchInfoType | SearchInfoSelectType | SearchInfoRadioType, // 검색 날짜, 옵션 관련 상태
    setSearchInfo: any, // searchInfo setState
    optionType?: 'SELECT' | 'RADIO', // 사용하는 옵션 타입
    selectOption?: Array<{ [x: string]: { title: string, value: string } }>, // select로 나타날 옵션 정보
    radioOption?: Array<{ [x: string]: { title: string, id: string, value: string } }>,  // radio로 나타날 옵션 정보
    optionList?: Array<any>, // option 맵핑할 때 사용  
    handleSearch: any, // 실제 검색하는 함수 (ex. refetch)
}

const CalanderSearch: React.FC<CalanderSearchProps> = ({ title, dateType, searchInfo, setSearchInfo, optionType = 'SELECT', selectOption, radioOption, optionList, handleSearch }) => {
    // TODO: Select onChange 변경
    const handleSearchSelect = (e: React.ChangeEvent<HTMLSelectElement>, idx1: number) => {
        let target = { value: e.target.value, title: e.target.childNodes[e.target.selectedIndex].textContent };

        return setSearchInfo((prev: SearchInfoSelectType) => {
            const newSearchOption = [...prev.searchOption.map((el, idx) => idx === idx1 ? target : el)]
            return { ...prev, searchOption: newSearchOption }
        }) as React.Dispatch<React.SetStateAction<SearchInfoSelectType>>
    };

    // TODO: Radio onChange 변경
    const handleSearchRadio = (searchType: string) => {
        return setSearchInfo((prev: SearchInfoRadioType) => {
            return { ...prev, searchType }
        }) as React.Dispatch<React.SetStateAction<SearchInfoRadioType>>;
    };

    return (
        <>
            {title && <p className="title bullet">{title}</p>}
            <div className="search-wrap">
                <div className="input-wrap">
                    <SearchCalanderItem date={searchInfo.from} dateType={dateType} updateDate={(date) => setSearchInfo((prev: any) => ({ ...prev, from: format(date!, dateType) }))} />
                    <i>~</i>
                    <SearchCalanderItem date={searchInfo.to} dateType={dateType} updateDate={(date) => setSearchInfo((prev: any) => ({ ...prev, to: format(date!, dateType) }))} />
                </div>

                {selectOption && optionList && isSelect(searchInfo) && optionType === 'SELECT' &&
                    <div className="select-wrap">
                        {selectOption.map((selectData, selectIdx) => { // #1: select 만들기 ... selectData = {POINT_ALL: {…}, POINT_1: {…}, POINT_2: {…}, POINT_3: {…}}
                            return (
                                <Fragment key={`select_${selectIdx}`}>
                                    <select name="" id="" value={searchInfo.searchOption[selectIdx].value} onChange={(e) => handleSearchSelect(e, selectIdx)}>
                                        {optionList[selectIdx].map((option: any, optionIdx: number) => {
                                            // console.log(optionList[idx1]) //  ['POINT_ALL', 'POINT_1', 'POINT_2', 'POINT_3']
                                            // console.log(option) // 'POINT_ALL'
                                            // console.log(selectData[option].value) // 'POINT_ALL'
                                            return <option key={`option_${optionIdx}`} value={selectData[option].value}>{selectData[option].title}</option>
                                        })}
                                    </select>&nbsp;
                                </Fragment>
                            )
                        })}
                    </div>
                }

                {radioOption && optionList && isRadio(searchInfo) && optionType === 'RADIO' &&
                    <div className='radio-wrap'>
                        {radioOption.map((selectData) => {
                            {/* #1: div 만들기 */ }
                            return optionList.map((option, optionListIdx) => {
                                return (
                                    <div key={`radio_wrapper_${optionListIdx}`} >
                                        <input
                                            className='radio'
                                            type='radio'
                                            name='date'
                                            id={`${selectData[option].id}`}
                                            value={selectData[option].value}
                                            defaultChecked={searchInfo.searchType === selectData[option].value}
                                            onChange={(e) => { searchInfo.searchType !== selectData[option].value && handleSearchRadio(selectData[option].value) }}
                                        />
                                        <label htmlFor={`${selectData[option].id}`}>{selectData[option].title}</label>
                                    </div>
                                )
                            })
                        })}
                    </div>
                }
                <button className="btn-search" onClick={handleSearch}>조회</button>
            </div>
        </>
    )
}

export default CalanderSearch

interface CalanderSearchItemProps {
    date: string, // 날짜 ex)2022-11-10
    dateType: string, // 날짜 형식
    updateDate: (date: any) => void, // 조회할 날짜 변경하는 함수
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