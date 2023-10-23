interface ICalculateDetailSearchButton {
  handleSearch: () => void;
}
const CalculateDetailSearchButton = ({ handleSearch }: ICalculateDetailSearchButton) => {
  return (
    <button className="btn-search" onClick={handleSearch}>
      조회
    </button>
  );
};

export default CalculateDetailSearchButton;
