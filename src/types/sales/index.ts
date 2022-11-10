
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
    from: string;
    to: string;
    data: any;
}

interface SalesTable {
	data: any;
	rowPerPage: number;
	currentPage: number;
}
export type { SalesStatisticPeriod, FilterSales, SalesLineChartProps, SalesTable };