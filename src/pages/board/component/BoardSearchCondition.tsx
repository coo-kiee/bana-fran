// API
import { useEventKeyCode } from "hooks/useEventKeyCode";
import { ChangeEventHandler, FC, useLayoutEffect, useState } from "react";
import BOARD_SERVICE from "service/boardService";

// Type
import { BoardInfo } from "types/board/boardType";
import { ListSearchParameter } from "..";

interface BoardSearchConditionProps {
    boardType: BoardInfo['type'],
    staffNo: number,
    fCode: number,
    searchCategory: ListSearchParameter['search_category'],
    searchText: ListSearchParameter['search_text'],
    setListSearchParameter: React.Dispatch<React.SetStateAction<ListSearchParameter>>
}
const BoardSearchCondition: FC<BoardSearchConditionProps> = ({ boardType, staffNo, fCode, searchCategory, searchText, setListSearchParameter }) => {

    const { data: categoryList } = BOARD_SERVICE.useCategoryList(['boardCategory', JSON.stringify({ boardType, staffNo })], boardType, fCode, staffNo);

    // 카테고리 변경
    const handleSearchCategory: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const value = Number(e.currentTarget.value);
        const newCategoryObj = { ...searchCategory, [boardType]: value };
        setListSearchParameter(prev => ({ ...prev, search_category: newCategoryObj, page_idx: 1 }));
    };

    // 제목 검색 State
    const [newSearchText, setNewSearchText] = useState('');
    useLayoutEffect(() => { // 탭 변경시 이전 검색내용 한번만 가져오기
        setNewSearchText(prev => searchText[boardType]);
        // eslint-disable-next-line
    }, [setNewSearchText, boardType]);

    // 리스트 조회
    const handleSearchBtn = () => {
        const newSearchTextObj = { ...searchText, [boardType]: newSearchText };
        setListSearchParameter(prev => ({ ...prev, search_text: newSearchTextObj, page_idx: 1 }));
    };
    useEventKeyCode(handleSearchBtn, 'Enter');  // Enter 입력 시 조회

    return (
        <div className="sort-wrap">
            <select name="search_category" id="" value={searchCategory[boardType]} onChange={handleSearchCategory}>
                <option value={0}>전체</option>
                {
                    categoryList && categoryList.length > 0 &&
                    categoryList.map(category => <option key={category.code} value={category.code}>{category.code_name}</option>)
                }
            </select>
            <input type="text" placeholder="제목/내용" name="search_text" value={newSearchText} onChange={(e) => setNewSearchText(e.target.value)} />
            <button className="btn-search" onClick={handleSearchBtn}>조회</button>
        </div>
    );
}

export default BoardSearchCondition;