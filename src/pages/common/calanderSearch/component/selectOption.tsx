import { Fragment } from "react";

// type
import { SearchInfoSelectType } from "types/etc/etcType";

/**
 * CalanderSearch의 Select 선택 옵션 컴포넌트에 필요한 프롭스 입니다.
 */
interface SelectOptionProps {
  /**
   * select로 나타낼 옵션 정보의 배열입니다.
   */
  selectOption: Array<{ [x: string | number]: { title: string, value: string | number } }>;
  /**
   * Select 내부 컴포넌트를 맵핑할 때 사용하는 배열입니다.
   */
  optionList: Array<any>,
  /**
   * 검색 날짜와 관련된 상태 정보입니다.
   * 
   * {@link SearchInfoSelectType}를 참고하세요.
   */
  searchInfo: SearchInfoSelectType,
  /**
   * select 옵션 선택 이벤트 핸들러 입니다.
   */
  handleSearchSelect: React.ChangeEventHandler<HTMLSelectElement>
}
/**
 * CalanderSearch의 Select 선택 옵션 컴포넌트 입니다.
 * 
 * @property {Array<{ [x: string | number]: { title: string, value: string | number } }>} [selectOption] 
 * @property {Array<any>} [optionList] 
 * @property {SearchInfoSelectType} searchInfo 
 * @property {React.ChangeEventHandler<HTMLSelectElement>} handleSearchSelect
 */
const SelectOption: React.FC<SelectOptionProps> = ({ selectOption, optionList, searchInfo, handleSearchSelect }) => {
  return (
    <div className="select-wrap">
      {selectOption.map((selectData, selectIdx) => (
        <Fragment key={`select_${selectIdx}`}>
          <select
            name=""
            id=""
            aria-label={searchInfo.searchOption[selectIdx].title.replace(' 전체', '')}
            data-selectindex={selectIdx}
            value={searchInfo.searchOption[selectIdx].value}
            onChange={handleSearchSelect}
          >
            {optionList[selectIdx].map((option: string, optionIdx: number) => (
              <option key={`option_${optionIdx}`} value={selectData[option].value}>
                {selectData[option].title}
              </option>
            ))}
          </select>
          &nbsp;
        </Fragment>
      ))}
    </div>
  );
};

export default SelectOption;