// common
interface SalesTable {
	data: any;
    isLoading: boolean;
	rowPerPage: number;
	currentPage: number;
}

// history
interface SalesHistorySearch {
	from: string;
	to: string;
	searchOption: any;
}
interface PrefixSumProps {
	data: any;
}

// statistics
interface SalesStatisticSearch {
    searchType: 'D' | 'M';
    from: string;
    to: string;
}
interface FilterChart {
    total: 0 | 1;
    paid: 0 | 1;
    app: 0 | 1;
    free: 0 | 1;
}
interface SalesLineChartProps {
    filterChart: FilterChart;
    data: any;
    searchType: 'D' | 'M';
}


export type { 
    SalesTable, 
    SalesHistorySearch, 
    PrefixSumProps, 
    SalesStatisticSearch, 
    FilterChart, 
    SalesLineChartProps, 
};