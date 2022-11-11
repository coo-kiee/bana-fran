
interface SalesStatisticPeriod {
    searchType: 'D' | 'M';
    from: string;
    to: string;
}

interface FilterSales {
    total: 0 | 1;
    paid: 0 | 1;
    app: 0 | 1;
    free: 0 | 1;
}

interface SalesLineChartProps {
    filterSales: FilterSales;
    data: any;
    searchType: 'D' | 'M';
}

interface SalesTable {
	data: any;
    isLoading: boolean;
	rowPerPage: number;
	currentPage: number;
}
export type { SalesStatisticPeriod, FilterSales, SalesLineChartProps, SalesTable };