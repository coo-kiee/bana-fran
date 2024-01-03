import React, { ChangeEventHandler } from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format, isBefore } from 'date-fns';

// style
import 'react-datepicker/dist/react-datepicker.css';

// component
import SelectOption from './component/selectOption';
import RadioOption from './component/radioOption';

// Type
import {
  SearchInfoType,
  SearchInfoSelectType,
  SearchInfoRadioType,
  isSelect,
  isRadio,
  OPTION_TYPE,
} from 'types/etc/etcType';
import { STATISTIC_SEARCH_TYPE } from 'constants/sales';

/**
 * 날짜 및 옵션 검색을 위한 공통 컴포넌트 입니다.
 *
 * props 타입은 {@link CalendarSearchProps}를 확인하세요.
 */
const CalanderSearch: React.FC<CalendarSearchProps> = ({
  title,
  dateTitle,
  dateType,
  searchInfo,
  setSearchInfo,
  optionType,
  selectOption,
  radioOption,
  optionList,
  handleSearch,
  ...datePickerProps
}) => {
  const searchCalendarOptionProps = {
    minDate: null,
    showMonthYearPicker: false,
    showFullMonthYearPicker: false,
    ...datePickerProps,
  };

  // searchType (datepicker 1개만 필요한 경우 판별용. 추후 확장성 고려해 수정 가능)
  const { searchType: selectSearchType } = searchInfo as SearchInfoRadioType;

  const handleDateUpdate = (key: keyof Omit<SearchInfoType, 'searchTrigger'>, value: Date) => {
    const newValue = format(value, dateType);
    setSearchInfo((prev: SearchInfoSelectType) => ({ ...prev, [key]: newValue }));
  };

  const handleSearchSelect: ChangeEventHandler<HTMLSelectElement> = ({
    target: { value, selectedIndex, childNodes, dataset },
  }) => {
    const currSearchOptionIdx = Number(dataset.selectindex);
    const target = { value, title: childNodes[selectedIndex].textContent };

    return setSearchInfo((prev: SearchInfoSelectType) => ({
      ...prev,
      searchOption: [...prev.searchOption.map((el, idx) => (idx === currSearchOptionIdx ? target : el))],
    })) as React.Dispatch<React.SetStateAction<SearchInfoSelectType>>;
  };

  const handleSearchRadio = (searchType: string) => {
    return setSearchInfo({
      from: format(new Date(searchInfo.from), searchType === STATISTIC_SEARCH_TYPE.MONTHLY ? 'yyyy-MM' : 'yyyy-MM-dd'),
      to: format(new Date(searchInfo.to), searchType === STATISTIC_SEARCH_TYPE.MONTHLY ? 'yyyy-MM' : 'yyyy-MM-dd'),
      searchType,
    }) as React.Dispatch<React.SetStateAction<SearchInfoRadioType>>;
  };

  const asyncHandleSearch = async () => {
    const { from, to } = searchInfo;
    // from이 to보다 늦은 날짜인 경우, 둘을 바꿔준 후 검색 실행
    if (isBefore(new Date(to), new Date(from))) {
      await setSearchInfo({ ...searchInfo, from: to, to: from });
    }
    await handleSearch();
  };

  return (
    <>
      {title && <p className="title bullet">{title}</p>}
      <div className="search-wrap">
        {dateTitle && <p className="title">{dateTitle}</p>}
        <div className="input-wrap">
          <DatePicker
            selected={new Date(searchInfo.from)}
            value={searchInfo.from}
            locale={ko}
            dateFormat={dateType}
            onChange={(date) => date !== null && handleDateUpdate('from', date)}
            maxDate={new Date()}
            {...searchCalendarOptionProps}
          />
          {selectSearchType !== STATISTIC_SEARCH_TYPE.HOURLY ? (
            <>
              <i>~</i>
              <DatePicker
                selected={new Date(searchInfo.to)}
                value={searchInfo.to}
                locale={ko}
                dateFormat={dateType}
                onChange={(date) => date !== null && handleDateUpdate('to', date)}
                maxDate={new Date()}
                {...searchCalendarOptionProps}
              />
            </>
          ) : null}
        </div>

        {selectOption && optionList && isSelect(searchInfo) && optionType === OPTION_TYPE.SELECT && (
          <SelectOption
            selectOption={selectOption}
            optionList={optionList}
            searchInfo={searchInfo}
            handleSearchSelect={handleSearchSelect}
          />
        )}

        {radioOption && optionList && isRadio(searchInfo) && optionType === OPTION_TYPE.RADIO && (
          <RadioOption
            radioOption={radioOption}
            optionList={optionList}
            searchInfo={searchInfo}
            handleSearchRadio={handleSearchRadio}
          />
        )}
        <button className="btn-search" onClick={asyncHandleSearch}>
          조회
        </button>
      </div>
    </>
  );
};

export default CalanderSearch;

/**
 * DatePicker 컴포넌트의 옵션과 관련된 타입 입니다.
 *
 * 이 타입은 ReactDatePickerProps의 옵션과 관련된 일부 프롭을 포함합니다.
 *
 * 해당 타입을 수정하는 경우 searchCalendarOptionProps도 수정이 필요합니다.
 * @property {Date | undefined | null} [minDate] - 선택 가능한 최소 날짜입니다. 이 날짜 이전의 날짜는 비활성화됩니다.
 * @property {boolean | undefined} [showMonthYearPicker] - 월과 연도만 표시하고 일을 표시하지 않는지 여부입니다.
 * @property {boolean | undefined} [showFullMonthYearPicker] - 전체 월과 연도 선택기를 큰 모달로 표시할지 여부입니다.
 */
type ReactDatePickerOptionProps = Pick<
  ReactDatePickerProps,
  'minDate' | 'showMonthYearPicker' | 'showFullMonthYearPicker'
>;
/**
 * 날짜 및 옵션 검색을 위한 공통 컴포넌트 CalanderSearch의 프롭스 타입입니다.
 *
 * <DatePicker /> 컴포넌트 옵션은 {@link ReactDatePickerOptionProps}를 참고하세요.
 *
 * @property {string} title
 * @property {string | JSX.Element} [dateTitle]
 * @property {string} dateType
 * @property {SearchInfoType | SearchInfoSelectType | SearchInfoRadioType} searchInfo
 * @property {any} setSearchInfo
 * @property {'SELECT' | 'RADIO'} [optionType]
 * @property {Array<{ [x: string | number]: { title: string, value: string | number } }>} [selectOption]
 * @property {Array<{ [x: string]: { title: string, id: string, value: string } }>} [radioOption]
 * @property {Array<any>} [optionList]
 * @property {any} handleSearch
 */
interface CalendarSearchProps extends ReactDatePickerOptionProps {
  /**
   * 컴포넌트의 제목입니다.
   */
  title?: string;
  /**
   * 날짜 제목입니다. 문자열 또는 JSX 엘리먼트로 지정할 수 있습니다.
   */
  dateTitle?: string | JSX.Element;
  /**
   * 날짜 형식을 지정하는 문자열입니다. 예: 'yyyy-MM-dd'
   */
  dateType: string;
  /**
   * 검색 날짜와 관련된 상태 정보입니다.
   *
   * 각 타입에 대해서는 {@link SearchInfoType}, {@link SearchInfoSelectType}, {@link SearchInfoRadioType}를 확인하세요.
   */
  searchInfo: SearchInfoType | SearchInfoSelectType | SearchInfoRadioType;
  /**
   * 검색 날짜와 관련된 상태를 업데이트하는 함수입니다.
   */
  setSearchInfo: any;
  /**
   * 상세내역 검색 시 사용하는 옵션의 컴포넌트 타입입니다.
   */
  optionType?: OPTION_TYPE;
  /**
   * select로 나타낼 옵션 정보의 배열입니다.
   */
  selectOption?: Array<{ [x: string | number]: { title: string; value: string | number } }>;
  /**
   * radio로 나타낼 옵션 정보의 배열입니다.
   */
  radioOption?: Array<{ [x: string]: { title: string; id: string; value: string } }>;
  /**
   * select / radio 내부에서 맵핑할 때 사용하는 배열입니다.
   */
  optionList?: Array<any>;
  /**
   * 검색을 실제로 수행하는 함수입니다.
   */
  handleSearch: any;
}
