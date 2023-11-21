import { FC, useRef } from 'react';

// type, constant
import { DetailTableProps } from 'types/event/eventType';
import { MEMBERSHIP_COL_THEAD_LIST } from 'constants/membership';

// hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';
import Sticky from 'pages/common/sticky';

// service
import MEMBERSHIP_SERVICE from 'service/membershipService';

const MonthRankDetailTable: FC<DetailTableProps> = ({ searchDate: { fromDate, toDate }, pageType }) => {
  const {
    user: { fCode, fCodeName },
  } = useUserInfo();
  const tableRef = useRef<HTMLTableElement>(null);
  const thRef = useRef<HTMLTableRowElement>(null);
  const { checkCurrentPageData } = usePageInfo();

  const listData = MEMBERSHIP_SERVICE.useRankList(
    ['membership_rank_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );
  useHandlePageDataCnt(listData);

  return (
    <>
      <Sticky reference={thRef.current} contentsRef={tableRef.current}>
        <Table.ColGroup colGroupAttributes={MEMBERSHIP_COL_THEAD_LIST[pageType].colgroup} />
        <Table.TableHead thData={MEMBERSHIP_COL_THEAD_LIST[pageType].thead} />
      </Sticky>
      <Table className="board-wrap" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={MEMBERSHIP_COL_THEAD_LIST[pageType].colgroup} />
        <Table.TableHead thData={MEMBERSHIP_COL_THEAD_LIST[pageType].thead} trRef={thRef} />
        <Table.TableList
          queryRes={listData}
          render={(datas) =>
            datas?.map(({ sDate, sName, nRank, sPhone, nickname, gift }, index) => {
              const [rewardType, rewardAmount] = gift.split(' ');

              return (
                <tr key={index} style={{ display: checkCurrentPageData(index) ? '' : 'none' }}>
                  <td>{sDate}</td>
                  <td>{sName}</td>
                  <td>{nRank}</td>
                  <td>
                    {sPhone || '번호 정보 없음'} <span>({nickname || '-'})</span>
                  </td>
                  <td>
                    {rewardType}
                    <p>{rewardAmount}</p>
                  </td>
                </tr>
              );
            })
          }
        />
      </Table>
      <div className="result-function-wrap">
        <ExcelButton
          type={'table'}
          target={tableRef}
          tableRef={tableRef}
          sheetOption={{ origin: 'B3' }}
          colWidths={MEMBERSHIP_COL_THEAD_LIST[pageType].colgroup.map(({ width }) =>
            width !== '*' ? { wpx: Number(width) } : { wpx: 400 },
          )}
          fileName={`${fromDate}~${toDate}_${fCodeName}_월간랭킹현황`}
          addRowColor={{ rowNums: [1], colors: ['d3d3d3'] }}
        />
        <Pages />
      </div>
    </>
  );
};

export default MonthRankDetailTable;
