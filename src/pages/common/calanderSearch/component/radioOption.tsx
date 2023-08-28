// type
import { SearchInfoRadioType } from "types/etc/etcType";

/**
 * CalanderSearch의 Radio 선택 옵션 컴포넌트에 필요한 프롭스 입니다.
 */
interface RadioOptionProps {
  /**
   * radio 버튼으로 나타낼 옵션 정보의 배열입니다.
   */
  radioOption: Array<{ [x: string]: { title: string, id: string, value: string } }>;
  /**
   * radio 내부 컴포넌트를 맵핑할 때 사용하는 배열입니다.
   */
  optionList: Array<any>,
  /**
   * 검색 날짜와 관련된 상태 정보입니다.
   * 
   * {@link SearchInfoSelectType}를 참고하세요.
   */
  searchInfo: SearchInfoRadioType,
  /**
   * radio 옵션 선택 이벤트 핸들러 입니다.
   */
  handleSearchRadio: (searchType: string) => React.Dispatch<React.SetStateAction<SearchInfoRadioType>>
}
/**
 * CalanderSearch의 Select 라디오 버튼 옵션 컴포넌트 입니다.
 * 
 * @property {Array<{ [x: string]: { title: string, id: string, value: string } }>} [radioOption] 
 * @property {Array<any>} [optionList] 
 * @property {SearchInfoRadioType} searchInfo 
 * @property {(searchType: string) => React.Dispatch<React.SetStateAction<SearchInfoRadioType>>} handleSearchRadio
 */
const RadioOption: React.FC<RadioOptionProps> = ({ radioOption, optionList, searchInfo, handleSearchRadio }) => {
  return (
    <div className="radio-wrap">
      {radioOption.map((selectData: any, selectDataIdx: number) =>
        optionList.map((option, optionListIdx) => (
          <div key={`radio_wrapper_${optionListIdx}`}>
            <input
              className="radio"
              type="radio"
              name="date"
              id={`${selectData[option].id}`}
              value={selectData[option].value}
              defaultChecked={searchInfo.searchType === selectData[option].value}
              onChange={() => {
                searchInfo.searchType !== selectData[option].value && handleSearchRadio(selectData[option].value);
              }}
            />
            <label htmlFor={`${selectData[option].id}`}>{selectData[option].title}</label>
          </div>
        ))
      )}
    </div>
  );
};

export default RadioOption