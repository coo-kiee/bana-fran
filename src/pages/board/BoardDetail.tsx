import { format } from 'date-fns';
import { useIsFetching } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

// Hook
import useUserInfo from 'hooks/user/useUser';

// API
import { useBoardAttachList, useBoardContent, useBoardDetail } from 'service/boardService';

// Util
import { fileDownload } from 'utils/fileDownload';

// Component
import Loading from 'pages/common/loading';

interface IBoardDetail {
  baseUrl: string;
}
const BoardDetail = ({ baseUrl }: IBoardDetail) => {
  const navigate = useNavigate();
  const { bId = '', bType = '' } = useParams();

  const { user } = useUserInfo();

  // Query
  const boardDetailRes = useBoardDetail({
    board_id: Number(bId),
    f_code: user.fCode,
    staff_no: user.staffNo,
  });
  const boardContentRes = useBoardContent(boardDetailRes.data?.contents || '');
  const boardAttachListRes = useBoardAttachList(Number(bId));

  const fetchingCnt = useIsFetching();

  if (!boardContentRes.data && fetchingCnt > 0) return <Loading marginTop={300} />;

  return (
    <>
      <div className="view-wrap">
        {boardDetailRes.data && (
          <>
            <div className="record-wrap">
              <p className="sort-state">{boardDetailRes.data.category_name}</p>
              <p className="sort-state">{format(new Date(boardDetailRes.data.insert_date), 'yyyy-MM-dd')}</p>
            </div>
            <div className="title-wrap">
              {boardDetailRes.data.important === '1' && <p className="icon-state">중요</p>}
              <p className="title">{boardDetailRes.data.title}</p>
            </div>
            <div className="content-wrap" dangerouslySetInnerHTML={{ __html: boardContentRes.data || '' }} />
            <div className="file-wrap">
              {boardAttachListRes.data?.map((file, index) => (
                <p className="file" key={index} onClick={() => fileDownload(file.file_url, file.origin_file_name)}>
                  <span>{`${file.origin_file_name} (${file.sFileSize})`}</span>
                </p>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="btn-wrap">
        <button className="btn-list-more" onClick={() => navigate(`${baseUrl}/${bType}`)}>
          목록
        </button>
      </div>
    </>
  );
};

export default BoardDetail;
