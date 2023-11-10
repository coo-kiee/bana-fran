import { useState } from 'react';

// Util
import Utils from 'utils/Utils';

interface ITab<T> {
  tabTitleObj: T;
  render: (tabType: keyof T) => JSX.Element;
}

const Tab = <T extends Record<string | number, string>>({ tabTitleObj, render }: ITab<T>) => {
  const initial = Object.keys(tabTitleObj)[0];

  const [tabType, setTabType] = useState(Utils.isNumber(initial) ? Number(initial) : initial);

  return (
    <>
      <ul className="tab-wrap">
        {Object.entries(tabTitleObj).map(([type, title], index) => (
          <li
            key={index}
            className={`tab ${type === String(tabType) ? 'active' : ''}`}
            onClick={() => setTabType(typeof tabType === 'number' ? Number(type) : type)}
          >
            {title}
          </li>
        ))}
      </ul>
      {render(tabType)}
    </>
  );
};

export default Tab;
