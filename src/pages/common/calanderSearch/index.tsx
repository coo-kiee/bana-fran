import { Fragment } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format, isBefore } from 'date-fns';

// style
import 'react-datepicker/dist/react-datepicker.css';

// Type
import { SearchInfoType, SearchInfoSelectType, SearchInfoRadioType, isSelect, isRadio } from 'types/etc/etcType';

interface CalendarSearchProps {
    title?: string, // 제목
    dateTitle?: string, // 날짜제목
    dateType: string, // 날짜 형식 ... ex) yyyy-MM-dd  
    searchInfo: SearchInfoType | SearchInfoSelectType | SearchInfoRadioType, // 검색 날짜, 옵션 관련 상태
    setSearchInfo: any, // searchInfo setState
    optionType?: 'SELECT' | 'RADIO', // 사용하는 옵션 타입
    selectOption?: Array<{ [x: string | number]: { title: string, value: string | number } }>, // select로 나타날 옵션 정보
    radioOption?: Array<{ [x: string]: { title: string, id: string, value: string } }>,  // radio로 나타날 옵션 정보
    optionList?: Array<any>, // option 맵핑할 때 사용  
    handleSearch: any, // 실제 검색하는 함수 (ex. refetch)
    minDate?: Date, // 검색가능한 기간(시작일) 설정
    showMonthYearPicker?: boolean, // 월만 보여주는 Datepicker 활성화 (기본값 false)
    showFullMonthYearPicker?: boolean, // 월만 보여주는 Datepicker 활성화 (기본값 false)
}

const CalanderSearch: React.FC<CalendarSearchProps> = ({ title, dateTitle, dateType, searchInfo, setSearchInfo, optionType = 'SELECT', selectOption, radioOption, optionList, handleSearch, minDate, showMonthYearPicker = false, showFullMonthYearPicker = false }) => {
    // TODO: Select onChange 변경
    const handleSearchSelect = (e: React.ChangeEvent<HTMLSelectElement>, idx1: number) => {
        let target = { value: e.target.value, title: e.target.childNodes[e.target.selectedIndex].textContent };

        return setSearchInfo((prev: SearchInfoSelectType) => {
            const newSearchOption = [...prev.searchOption.map((el, idx) => idx === idx1 ? target : el)]
            return { ...prev, searchOption: newSearchOption }
        }) as React.Dispatch<React.SetStateAction<SearchInfoSelectType>>
    };

    // TODO: Radio onChange 변경
    /* 11-14 수정: 일/월 검색조건에 따라 value format도 달라지기 때문에 함수 내 조건 추가 및 상태변경 수정 */
    const handleSearchRadio = (searchType: string) => {
        return setSearchInfo((prev: SearchInfoRadioType) => {
            return (
                searchType === 'M' ? 
                {
                    from: format(new Date(searchInfo.from), 'yyyy-MM'), 
                    to: format(new Date(searchInfo.to), 'yyyy-MM'),
                    searchType
                } : 
                {
                    from: format(new Date(searchInfo.from), 'yyyy-MM-dd'), 
                    to: format(new Date(searchInfo.to), 'yyyy-MM-dd'),
                    searchType                    
                }
            )
        }) as React.Dispatch<React.SetStateAction<SearchInfoRadioType>>;
    };

    const asyncHandleSearch = async () => {
        const {from, to} = searchInfo
        if (isBefore(new Date(to), new Date(from))) {
            await setSearchInfo({...searchInfo, from: to, to: from})
        }
        await handleSearch();
    }
    return (
        <>
            {title && <p className="title bullet">{title}</p>}
            <div className="search-wrap">
                {dateTitle && <p className="title">{dateTitle}</p>}
                <div className="input-wrap">
                    <SearchCalendarItem date={searchInfo.from} dateType={dateType} updateDate={(date) => setSearchInfo((prev: any) => ({ ...prev, from: format(date!, dateType) }))} minDate={minDate} showMonthYearPicker={showMonthYearPicker} showFullMonthYearPicker={showFullMonthYearPicker} />
                    <i>~</i>
                    <SearchCalendarItem date={searchInfo.to} dateType={dateType} updateDate={(date) => setSearchInfo((prev: any) => ({ ...prev, to: format(date!, dateType) }))} minDate={minDate} showMonthYearPicker={showMonthYearPicker} showFullMonthYearPicker={showFullMonthYearPicker} />
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
                        {radioOption.map((selectData: any, selectDataIdx: number) => {
                            /* #1: div 만들기 */ 
                            return optionList.map((option, optionListIdx) => {
                                return ( 
                                    // (optionListIdx === selectDataIdx) &&
                                    <div key={`radio_wrapper_${optionListIdx}`} >
                                        <input
                                            className='radio'
                                            type='radio'
                                            name='date'
                                            id={`${selectData[option].id}`}
                                            value={selectData[option].value}
                                            defaultChecked={searchInfo.searchType === selectData[option].value}
                                            onChange={() => { searchInfo.searchType !== selectData[option].value && handleSearchRadio(selectData[option].value) }}
                                        />
                                        <label htmlFor={`${selectData[option].id}`}>{selectData[option].title}</label>
                                    </div>
                                )
                            })
                        })}
                    </div>
                }
                <button className="btn-search" onClick={asyncHandleSearch}>조회</button>
            </div>
        </>
    )
}

export default CalanderSearch

interface CalendarSearchItemProps {
    date: string, // 날짜 ex)2022-11-10
    dateType: string, // 날짜 형식
    updateDate: (date: any) => void, // 조회할 날짜 변경하는 함수
    minDate: Date | undefined,
    showMonthYearPicker: boolean,
    showFullMonthYearPicker: boolean,

}
const SearchCalendarItem: React.FC<CalendarSearchItemProps> = ({ date, dateType, updateDate, minDate = undefined, showMonthYearPicker, showFullMonthYearPicker }) => {
    return (
        <DatePicker
            selected={new Date(date)}
            value={date}
            locale={ko}
            dateFormat={dateType}
            onChange={(date) => updateDate(date)}
            minDate={minDate}
            maxDate={new Date()}
            showMonthYearPicker={showMonthYearPicker}
            showFullMonthYearPicker={showFullMonthYearPicker}
        />
    )
}