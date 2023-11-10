import { FC } from 'react';

// type, constants
import { ETC_TAB_SUBTITLE } from 'constants/etc';
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
