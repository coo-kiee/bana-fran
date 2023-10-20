import { MouseEventHandler, useState } from 'react';
interface ICalculateTab<T extends Record<string, string | number>> {
  tabTypeObj: T;
  tabTitleObj: Record<T[keyof T] | number, string>;
  render: (tabType: T[keyof T]) => JSX.Element;
}

const CalculateTab = <T extends Record<string, string | number>>({
  tabTypeObj,
  tabTitleObj,
  render,
}: ICalculateTab<T>) => {
  const [tabType, setTabType] = useState(Object.values(tabTypeObj)[0] as T[keyof T]);

  const handleTab: MouseEventHandler<HTMLElement> = (e) => {
    const dataSetType = e.currentTarget.dataset.type;
    if (!dataSetType) return;

    const value = typeof tabType === 'number' ? Number(dataSetType) : dataSetType;

    setTabType(value as T[keyof T]);
  };

  return (
    <>
      <ul className="tab-wrap">
        {Object.values(tabTypeObj).map((type, index) => (
          <li key={index} className={`tab ${type === tabType ? 'active' : ''}`} data-type={type} onClick={handleTab}>
            {tabTitleObj[type as keyof typeof tabTitleObj]}
          </li>
        ))}
      </ul>
      {render(tabType)}
    </>
  );
};

export default CalculateTab;
