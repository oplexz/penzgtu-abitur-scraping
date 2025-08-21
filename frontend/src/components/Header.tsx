import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import type { Statistics } from '../types/api';

interface HeaderProps {
    loading: boolean;
    onScraping: () => void;
    onSearch: (code: string) => void;
    error: string | null;
    statistics: Statistics | null;
}

export function Header({
    loading,
    onScraping,
    onSearch,
    error,
    statistics,
}: HeaderProps) {
    const [searchCode, setSearchCode] = useState<string>('');

    const handleSearch = () => {
        if (searchCode.trim()) {
            onSearch(searchCode.trim());
        }
    };

    const formatTimestamp = (timestamp: string): string => {
        try {
            return format(new Date(timestamp), 'dd.MM.yyyy HH:mm', {
                locale: ru,
            });
        } catch {
            return timestamp;
        }
    };

    return (
        <div className='mb-8'>
            <h1 className='text-4xl font-bold mb-6'>
                Мониторинг поступающих в аспирантуру ПензГТУ
            </h1>

            <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
                <div className='flex gap-4'>
                    <input
                        type='text'
                        placeholder='Код абитуриента'
                        className='input input-bordered min-w-[200px]'
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        className='btn btn-outline'
                        onClick={handleSearch}
                        disabled={!searchCode.trim()}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                            />
                        </svg>
                        Найти
                    </button>
                </div>

                <div className='flex flex-wrap gap-4'>
                    {statistics?.timestamp && (
                        <div className='flex items-center gap-2 text-sm text-base-content/70'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-4 w-4'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                />
                            </svg>
                            <span>
                                Последнее обновление:{' '}
                                {formatTimestamp(statistics.timestamp)}
                            </span>
                        </div>
                    )}
                    <button
                        className='btn btn-primary'
                        onClick={onScraping}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className='loading loading-spinner loading-sm'></span>
                        ) : (
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                                />
                            </svg>
                        )}
                        {loading ? 'Обновление...' : 'Обновить данные'}
                    </button>
                </div>
            </div>

            {error && (
                <div role='alert' className='alert alert-error mb-6'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 shrink-0 stroke-current'
                        fill='none'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
