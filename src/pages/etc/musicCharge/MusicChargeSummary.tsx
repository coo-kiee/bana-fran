import Utils from 'utils/Utils';

// hook
import useUserInfo from 'hooks/user/useUser';

// service
import ETC_SERVICE from 'service/etcService';

const MusicChargeSummary = () => {
  const {
    user: { fCode },
  } = useUserInfo();

  let summaryData = [
    {
      std_date: '-',
      item: '음악사용료 차감예정 (익월 5일)',
      supply_amt: 0,
      vat_amt: 0,
      total_amt: 0,
    },
    {
      std_date: '-',
      item: '공연권료 차감예정 (익월 5일)',
      supply_amt: 0,
      vat_amt: 0,
      total_amt: 0,
    },
  ];

  const { data, isSuccess } = ETC_SERVICE.useMusicTotal(fCode);

  if (isSuccess) {
    summaryData = data;
  }

  return (
    <>
      {summaryData.map(({ std_date, item, supply_amt, vat_amt, total_amt }, idx) => (
        <tr key={idx}>
          <td className="align-center">{std_date}</td>
          <td className="align-left">{item}</td>
          <td className="align-center">{Utils.numberComma(supply_amt)}</td>
          <td className="align-center">{Utils.numberComma(vat_amt)}</td>
          <td className="align-center">{Utils.numberComma(total_amt)}</td>
        </tr>
      ))}
    </>
  );
};

export default MusicChargeSummary;
