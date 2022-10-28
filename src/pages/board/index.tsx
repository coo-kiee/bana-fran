import { FC, useState } from "react";
import { useRecoilValue } from "recoil";

// css
import 'assets/sass/dataroom.scss';

// Type
import { BOARD_GROUP, ListSearchCondition, MenuType, MENU_TYPE } from "types/board/boardType";


// state
import { loginState } from "state";

// component
import BoardTab from "./component/BoardTab";
import SelectCondition from "./component/BoardSelectCondition";
import BoardTable from "./component/BoardTable";
import BoardHeader from "./component/BoardHeader";

const BoardContainer: FC<{ menuType:MenuType }> = ({ menuType=MENU_TYPE.ARCHAIVE }) => {

    const { userInfo } = useRecoilValue(loginState);

    const initialData = {
        f_code: 0,
        staff_no: userInfo.staff_no || 0,
        board_type: BOARD_GROUP[menuType][0].type,
        search_category: 0,
        search_text: "",
        page_idx: 1,
        page_size: 50,
    };
    
    const [listSearchCondition, setListSearchCondition] = useState<ListSearchCondition>(initialData);
    const { board_type, search_category } = listSearchCondition;

    return (
        <section className="container">
            <BoardHeader menuType={menuType} />
            <section className="contents-wrap dataroom-wrap">
                <div className="contents">
                    <BoardTab menuType={menuType} boardType={board_type} setListSearchCondition={setListSearchCondition} />
                    <div id="tab1" className="tab-content active">
                        <SelectCondition boardType={board_type} searchCategory={search_category} setListSearchCondition={setListSearchCondition} />
                        <BoardTable listSearchCondition={listSearchCondition} setListSearchCondition={setListSearchCondition} />
                    </div>
                </div>
            </section>
        </section>
    );
}

export default BoardContainer;