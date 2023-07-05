// type
import { ETC_TAB_TYPE } from "types/etc/etcType";

// component
import VirtualAccountDetail from "./VirtualAccountDetail";
import EtcTotalTable from "../component/EtcTotalTable";

const VirtualAccount = () => {
  // TODO: EtcDetailTable 관련 데이터
  // table과 sticky의 th width 불일치로 인한 %값 환산 적용 (원본: ["170", "170", "503", "503", "170", "503"])
  const detailTableColGroup = ["8.42%", "8.42%", "24.91%", "24.91%", "8.42%", "24.92%"];
  const detailTableHead = [
    [
      { itemName: "거래일시" },
      { itemName: "거래구분" },
      { itemName: "거래금액" },
      { itemName: "상태" },
      { itemName: "거래 후 잔액" },
      { itemName: "적요" },
    ],
  ];

  return (
    <>
      <div className="board-date-wrap">
        <EtcTotalTable currTab={ETC_TAB_TYPE.ACCOUNT} />
        <VirtualAccountDetail
          detailTableColGroup={detailTableColGroup}
          detailTableHead={detailTableHead}
        />
      </div>
    </>
  );
};

export default VirtualAccount;
