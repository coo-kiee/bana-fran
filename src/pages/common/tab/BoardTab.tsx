import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Util
import Utils from 'utils/Utils';

interface IBoardTab<T> {
  baseUrl: string;
  urlParamKey: string;
  tabTitleObj: T;
  render: (tabType: keyof T) => JSX.Element;
}

const BoardTab = <T extends Record<string | number, string>>({
  baseUrl,
  urlParamKey,
  tabTitleObj,
  render,
}: IBoardTab<T>) => {
  const navigate = useNavigate();
  const params = useParams();
  const paramsVal = urlParamKey ? params[urlParamKey] : '';

  const [tabType, setTabType] = useState(() => {
    const tabs = Object.keys(tabTitleObj);

    if (paramsVal && tabs.includes(paramsVal)) return Utils.isNumber(paramsVal) ? Number(paramsVal) : paramsVal;

    const initial = tabs[0];
    return Utils.isNumber(initial) ? Number(initial) : initial;
  });

  const handleTabType = (type: string) => {
    setTabType(typeof tabType === 'number' ? Number(type) : type);

    navigate(`${baseUrl}/${type}`, { replace: true });
  };

  return (
    <>
      <ul className="tab-wrap">
        {Object.entries(tabTitleObj).map(([type, title], index) => (
          <li
            key={index}
            className={`tab ${type === String(tabType) ? 'active' : ''}`}
            onClick={() => handleTabType(type)}
          >
            {title}
          </li>
        ))}
      </ul>
      {render(tabType)}
    </>
  );
};

export default BoardTab;
