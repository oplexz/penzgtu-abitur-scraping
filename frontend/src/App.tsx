import { useEffect, useState } from 'react';
import { Header, Statistics, DirectionsList, SearchDialog } from './components';
import { apiService } from './services/api';
import type {
    ApplicantSearchResponse,
    SessionData,
    Statistics as StatisticsType,
} from './types/api';

interface SearchResultWithError extends ApplicantSearchResponse {
    error?: string;
}

function App() {
    const [data, setData] = useState<SessionData | null>(null);
    const [statistics, setStatistics] = useState<StatisticsType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchResult, setSearchResult] =
        useState<SearchResultWithError | null>(null);
    const [searchDialog, setSearchDialog] = useState<boolean>(false);

    // Загрузка данных при запуске
    useEffect(() => {
        loadLatestData();
        loadStatistics();
    }, []);

    const loadLatestData = async () => {
        try {
            setError(null);
            const response = await apiService.getLatest();
            setData(response.data);
        } catch (err: any) {
            setError(
                'Ошибка загрузки данных: ' +
                    (err.response?.data?.detail || err.message)
            );
        }
    };

    const loadStatistics = async () => {
        try {
            const response = await apiService.getStatistics();
            setStatistics(response.data);
        } catch (err: any) {
            console.error('Ошибка загрузки статистики:', err);
        }
    };

    const handleScraping = async () => {
        setLoading(true);
        setError(null);
        try {
            await apiService.runScraping();
            await loadLatestData();
            await loadStatistics();
            setError(null);
        } catch (err: any) {
            setError(
                'Ошибка скрейпинга: ' +
                    (err.response?.data?.detail || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (code: string) => {
        try {
            const response = await apiService.findApplicant(code);
            setSearchResult(response.data);
            setSearchDialog(true);
        } catch (err: any) {
            setSearchResult({
                applicant_code: code,
                found_in: [],
                error: err.response?.data?.detail || err.message,
            });
            setSearchDialog(true);
        }
    };

    return (
        <div className='container mx-auto max-w-7xl px-4 py-8'>
            <Header
                loading={loading}
                onScraping={handleScraping}
                error={error}
                statistics={statistics}
            />

            <Statistics statistics={statistics} />

            <DirectionsList data={data} onApplicantClick={handleSearch} />

            <SearchDialog
                isOpen={searchDialog}
                searchResult={searchResult}
                onClose={() => setSearchDialog(false)}
            />
        </div>
    );
}

export default App;
