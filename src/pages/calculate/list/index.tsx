import { useState } from 'react';
import { format, subMonths } from 'date-fns';

// Type
import { CALCULATE_TYPE } from 'types/calculate/calculateType';

// Hook
import useUserInfo from 'hooks/user/useUser';
import useOnChange from 'hooks/useOnChange';

// API
import { useCalculateMonthList } from 'service/calculateService';

// Component
import CalculatePrecautions from '../component/CalculatePrecautions';
import CalculateSection from '../component/CalculateSection';
import Select from 'pages/common/select';
import ListTable from './ListTable';

const CalculateList = () => {
  const caculateType = CALCULATE_TYPE.LIST;

  const { user } = useUserInfo();

  const [selectDate, setSelectDate] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'));
  const handleSelectDate = useOnChange(setSelectDate);

  // Query
  const monthListRes = useCalculateMonthList({ f_code: user.fCode });
  const initialMonthList = [
    {
      label: format(subMonths(new Date(), 1), 'yyyy-MM'),
      value: format(subMonths(new Date(), 1), 'yyyy-MM'),
    },
  ];

  return (
    <CalculateSection caculateType={caculateType}>
      <CalculatePrecautions caculateType={caculateType} />
      <div className="function-wrap">
        <div className="search-wrap">
          <div className="select-wrap">
            <Select
              name=""
              value={selectDate}
              options={[
                ...(monthListRes.data?.map((item) => ({ label: item.std_month, value: item.std_month })) ||
                  initialMonthList),
              ]}
              handleOnChange={handleSelectDate}
            />
          </div>
        </div>
        <ListTable selectDate={selectDate} />
      </div>
    </CalculateSection>
  );
};

export default CalculateList;
