import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Util
import Utils from 'utils/Utils';

interface IBoardTab<T> {
  baseUrl: string;
  tabTitleObj: T;
  render: (tabType: keyof T) => JSX.Element;
}

const BoardTab = <T extends Record<number, string>>({ baseUrl, tabTitleObj, render }: IBoardTab<T>) => {
  const navigate = useNavigate();
  const params = useParams();

  const [tabType, setTabType] = useState(() => {
    const tabs = Object.keys(tabTitleObj);

    if (params.bType && tabs.includes(params.bType)) return Number(params.bType);

    const initial = tabs[0];
    return Number(initial);
  });

  const [bIdInfo] = useState(() =>
    Object.keys(tabTitleObj).reduce(
      (arr, cur) => ({ ...arr, [cur]: Utils.isNumber(params.bId) ? Number(params.bId) : 0 }),
      {} as Record<number, number>,
    ),
  );
  bIdInfo[tabType] = Utils.isNumber(params.bId) ? Number(params.bId) : 0;

  const handleTabType = (type: string) => {
    const nType = Number(type);
    setTabType(nType);

    navigate(`${baseUrl}/${nType}/${bIdInfo[nType] || ''}`, { replace: true });
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
