import { FC } from "react";
import { saveAs } from 'file-saver';

// Css
import 'assets/sass/notice_view.scss'

// Service
import BOARD_SERVICE from "service/board";

// Type
import { BoardDetailType } from "types/board/boardType";
import axios from "axios";
import { DetailInfo } from "pages/board";

interface BoardDetailProps {
    boardId: number,
    staffNo: number,
    fCode: number,
    setDetailInfo: React.Dispatch<React.SetStateAction<DetailInfo>>,
};
const BoardDetail: FC<BoardDetailProps> = ({ boardId, staffNo, fCode, setDetailInfo }) => {

    const detailKey = ['board', JSON.stringify({ boardId, staffNo, fCode })];
    const { data: boardDetail } = BOARD_SERVICE.getBoard(detailKey, boardId, staffNo, fCode);
    const { category_name, title, insert_date, important, contents, board_type } = boardDetail as BoardDetailType || {};

    // 목록 버튼 클릭시 List로 이동
    const goToList = () => {
        setDetailInfo(prev => ({ ...prev, isDetail: false, [board_type]: 0 }));
    };

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
                        <div className="content-wrap">
                            {contents}
                        </div>
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



const FileList: FC<{ boardId: number }> = ({ boardId }) => {

    const fileKey = ['board', boardId.toString()];
    const { data: fileInfo } = BOARD_SERVICE.getBoardAttachList(fileKey, boardId);

    const downloadFile = async (url: string, fileName: string) => {
        try {
            const res: any = await axios.get(url, { responseType: `blob` });
            saveAs(res.data, fileName);
        }
        catch (error) {
            console.log(error);
        };
    };

    return (
        <div className="file-wrap">
            {
                fileInfo?.map((file, index) => {
                    const { file_url, origin_file_name } = file;
                    return (
                        <p className="file" key={index} onClick={() => downloadFile(file_url, origin_file_name)}><span>{origin_file_name}</span></p>
                    )
                })
            }
        </div>
    )
};