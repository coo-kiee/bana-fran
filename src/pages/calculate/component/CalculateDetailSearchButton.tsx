import { PropsWithChildren } from 'react';

interface ICalculateDetailSearchButton extends PropsWithChildren {
  handleSearch: () => void;
}
const CalculateDetailSearchButton = ({ children, handleSearch }: ICalculateDetailSearchButton) => {
  return (
    <>
      {children}
      <button className="btn-search" onClick={handleSearch}>
        조회
      </button>
    </>
  );
};

export default CalculateDetailSearchButton;
