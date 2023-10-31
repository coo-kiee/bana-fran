import { useState } from 'react';
interface ICalculateTab<T> {
  tabTitleObj: T;
  render: (tabType: keyof T) => JSX.Element;
}

const CalculateTab = <T extends Record<string | number, string>>({ tabTitleObj, render }: ICalculateTab<T>) => {
  const [tabType, setTabType] = useState(Object.keys(tabTitleObj)[0]);

  return (
    <>
      <ul className="tab-wrap">
        {Object.entries(tabTitleObj).map(([type, title], index) => (
          <li key={index} className={`tab ${type === tabType ? 'active' : ''}`} onClick={() => setTabType(type)}>
            {title}
          </li>
        ))}
      </ul>
      {render(tabType)}
    </>
  );
};

export default CalculateTab;
