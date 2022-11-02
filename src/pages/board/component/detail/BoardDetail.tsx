import { FC, useEffect, } from "react";
import { saveAs } from 'file-saver';
import { useNavigate } from "react-router-dom";

// Hook
import { queryFn } from "hooks/useQuery";

// Css
import 'assets/sass/notice_view.scss'

// Service
import BOARD_SERVICE from "service/board";

// Type
import { BoardDetailType, MenuType } from "types/board/boardType";

interface BoardDetailProps {
    menuType: MenuType,
    boardId: number,
    staffNo: number,
    fCode: number,
};
const BoardDetail: FC<BoardDetailProps> = ({ menuType, boardId, staffNo, fCode }) => {

    const detailKey = ['board', JSON.stringify({ boardId, staffNo, fCode })];
    const { data: boardDetail } = BOARD_SERVICE.getBoard(detailKey, boardId, staffNo, fCode);
    const { category_name, title, insert_date, important, contents, board_type } = boardDetail as BoardDetailType || {};

    // 목록 버튼 클릭시 List로 이동
    const goToList = () => {
        navigation(`/${menuType}/${board_type}`);
    };
    
    const navigation = useNavigate();
    useEffect(() => { // 상세 데이터 없으면 이전 페이지로 이동
        if(!boardDetail) navigation(-1);
    }, [])

    return (
        <>
            {
                boardDetail &&
                <>
                    <div className="view-wrap">
                        {/* <!-- 카테고리, 날짜 --> */}
                        <div className="record-wrap">
                            <p className="sort-state">{category_name}</p>
                            <p className="date">{insert_date.substring(0, 10)}</p>
                        </div>
                        {/* <!-- 상태, 제목 --> */}
                        <div className="title-wrap">
                            {important === '1' && <p className="icon-state">중요</p>}
                            <p className="title">{title}</p>
                        </div>
                        {/* <!-- 내용 --> */}
                        <Content contentsUrl={contents} />
                        {/* <!-- 파일첨부 --> */}
                        {<FileList boardId={boardId} />}
                    </div>
                    <div className="btn-wrap">
                        <button className="btn-list-more" onClick={goToList}>목록</button>
                    </div>
                </>
            }
        </>
    );
}

export default BoardDetail;



const Content: FC<{ contentsUrl: string }> = ({ contentsUrl }) => {

    // Suspense 적용을 위해 React Query 적용
    const {data:content} = BOARD_SERVICE.getContent([contentsUrl], contentsUrl);

    return (
        <div className="content-wrap" dangerouslySetInnerHTML={{__html: content as string}} />
    )
};

const FileList: FC<{ boardId: number }> = ({ boardId }) => {

    const fileKey = ['board', boardId.toString()];
    const { data: fileInfo } = BOARD_SERVICE.getBoardAttachList(fileKey, boardId);

    const downloadFile = async (url: string, fileName: string) => {
        try {
            const res = await queryFn.axiosGet(url, {}, { responseType: `blob` });
            saveAs(res, fileName);
        }
        catch (error) {
            console.log('첨부파일 다운로드에 실패했습니다.', error);
        };
    };

    return (
        <div className="file-wrap">
            {
                fileInfo?.map((file, index) => {
                    const { file_url, origin_file_name, sFileSize } = file;
                    return (
                        <p className="file" key={index} onClick={() => downloadFile(file_url, origin_file_name)}><span>{`${origin_file_name} (${sFileSize})`}</span></p>
                    )
                })
            }
        </div>
    )
};