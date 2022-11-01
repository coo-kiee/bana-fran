import 'assets/sass/notice.scss';

// Type
import { MENU_TYPE } from 'types/board/boardType';

// component
import BoardContainer from 'pages/board';

const NoticeContainer = () => {
    
    return (
        <BoardContainer menuType={MENU_TYPE.NOTICE} />
    );
}

export default NoticeContainer;