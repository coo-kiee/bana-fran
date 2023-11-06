import { FC } from 'react';

// Const
import { LIST_HISTORY_COLUMN_INFO, LIST_HISTORY_THEAD_INFO } from 'constants/calculate/list';

// API
import { useCalculateFixList } from 'service/calculateService';

// Hook
import useModal from 'hooks/common/useModal';
import useUserInfo from 'hooks/user/useUser';

// Component
import Table from 'pages/common/table';

interface ChangeHistoryModalProps {
  calculateId: number;
}
const ChangeHistoryModal: FC<ChangeHistoryModalProps> = ({ calculateId }) => {
  const { user } = useUserInfo();

  const { popModal } = useModal();

  // Query
  const fixListRes = useCalculateFixList({
    nFCode: user.fCode,
    calculate_id: calculateId,
  });

  return (
    <div
      className="alert-layer history-layer active"
      style={fixListRes.data?.length || 0 >= 10 ? { paddingTop: '100px', paddingBottom: '100px' } : undefined}
    >
      <div className="msg-wrap">
        <p className="title">수정요청/변경이력</p>
        <div style={{ overflow: 'auto', maxHeight: '1000px' }}>
          <Table className="board-wrap" cellPadding="0" cellSpacing="0">
            <Table.ColGroup colGroupAttributes={LIST_HISTORY_COLUMN_INFO} />
            <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={LIST_HISTORY_THEAD_INFO} />
            <Table.TableList
              queryRes={fixListRes}
              isPagination={false}
              render={(datas) =>
                datas.map((data, index) => {
                  const [date, time] = data.log_date.split(' ');
                  const [staffName, storeName] = data.insert_staff_name.split('(');

                  return (
                    <tr key={index}>
                      <td>
                        {date}
                        <br />
                        {time}
                      </td>
                      <td>{data.log_type}</td>
                      <td>
                        {staffName && <br />}
                        {storeName}
                      </td>
                      <td>{data.comment}</td>
                      <td className="content" style={{ whiteSpace: 'pre' }}>
                        {data.pre_data}
                      </td>
                      <td className="content" style={{ whiteSpace: 'pre' }}>
                        {data.change_data}
                      </td>
                    </tr>
                  );
                })
              }
            />
          </Table>
        </div>
        <button className="btn-close history-close" onClick={popModal}></button>
        <button className="cta-btn" onClick={popModal}>
          확인
        </button>
      </div>
    </div>
  );
};

export default ChangeHistoryModal;
