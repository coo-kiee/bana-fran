import { FC } from 'react';

// type, constants
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const EtcInfo: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  return (
    <div className="info-wrap">
      <p>
        ※ {ETC_TAB_SUBTITLE[tabType]}{' '}
        {tabType !== ETC_TAB_TYPE.ACCOUNT && (
          <strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong>
        )}
      </p>
    </div>
  );
};

export default EtcInfo;

const ETC_TAB_SUBTITLE = {
  [ETC_TAB_TYPE.DELIVERY]: '바나 딜리버리 수수료 내역을 조회할 수 있습니다.',
  [ETC_TAB_TYPE.MUSIC]: '매월 매장 음악 서비스 이용료를 조회할 수 있습니다.',
  [ETC_TAB_TYPE.GIFTCARD]: '실물 상품권 발주/위탁판매내역을 조회할 수 있습니다.',
  [ETC_TAB_TYPE.ORDER]: '상세 발주 내역을 조회할 수 있습니다.',
  [ETC_TAB_TYPE.ROYALTY]: '매월 매장 로열티를 조회할 수 있습니다.',
  [ETC_TAB_TYPE.ACCOUNT]: '가상계좌 충전/차감 내역을 조회할 수 있습니다.',
} as const;
