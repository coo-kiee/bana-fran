// Service
import { useEventKeyCode } from "hooks/useEventKeyCode";
import { ChangeEventHandler, FC, MouseEventHandler, useState } from "react";
import BOARD_SERVICE from "service/board";

// Type
import { BoardType, ListSearchCondition } from "types/board/boardType";

interface BoardSelectConditionProps {
    boardType: BoardType['type'],
    // searchText: string,
    searchCategory: number,
    setListSearchCondition: React.Dispatch<React.SetStateAction<ListSearchCondition>>
}
const BoardSelectCondition: FC<BoardSelectConditionProps> = ({ boardType, searchCategory, setListSearchCondition }) => {

    const { data: categoryList, isFetching } = BOARD_SERVICE.getCategoryList(['boardCategory', boardType + ''], boardType);

    const [searchText, setSearchText] = useState('');

    // 카테고리 변경
    const handleSearchData: ChangeEventHandler<HTMLSelectElement | HTMLInputElement> = (e) => {
        const key = e.currentTarget.name;
        const value = parseInt(e.currentTarget.value);
        setListSearchCondition(prev => ({ ...prev, [key]: value }));
    };

    // 카테고리 제목 검색
    const handleSearchBtn = () => {
        setListSearchCondition(prev => ({ ...prev, search_text: searchText }));
    };
    // Enter 입력 시 검색실행
    useEventKeyCode(handleSearchBtn, 'Enter');

    return (
        <div className="sort-wrap">
            <select name="search_category" id="" value={searchCategory} onChange={handleSearchData}>
            <option value={0}>전체</option>
                {
                    categoryList && categoryList.length > 0 &&
                    categoryList.map(category => <option key={category.code} value={category.code}>{category.code_name}</option>)
                }
            </select>
            <input type="text" placeholder="제목/내용" name="search_text" value={searchText} onChange={(e) => setSearchText(e.currentTarget.value)} />
            <button className="btn-search" onClick={handleSearchBtn}>조회</button>
        </div>
    );
}

export default BoardSelectCondition;