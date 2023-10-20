import { ColHTMLAttributes, FC } from 'react';

interface IColGroup {
  colGroupAttributes: ColHTMLAttributes<HTMLTableColElement>[];
}
const ColGroup: FC<IColGroup> = ({ colGroupAttributes }) => {
  return (
    <colgroup>
      {colGroupAttributes.map((colGroupAttribute, index) => (
        <col {...colGroupAttribute} key={index} />
      ))}
    </colgroup>
  );
};

export default ColGroup;
