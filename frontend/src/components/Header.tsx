import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Statistics } from '../types/api';

interface HeaderProps {
    loading: boolean;
    onScraping: () => void;
    error: string | null;
    statistics: Statistics | null;
}

export function Header({
    loading,
    onScraping,
    error,
    statistics,
}: HeaderProps) {
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
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight'>
                Мониторинг поступающих в аспирантуру ПензГТУ
            </h1>

            <div className='flex flex-col sm:flex-row sm:items-end sm:justify-end gap-4 mb-6'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                    {statistics?.timestamp && (
                        <div className='flex items-center gap-2 text-sm text-base-content/70'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-4 w-4 flex-shrink-0'
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
                            <span className='break-words'>
                                <span className='hidden sm:inline'>
                                    Последнее обновление:{' '}
                                </span>
                                <span className='sm:hidden'>Обновлено: </span>
                                {formatTimestamp(statistics.timestamp)}
                            </span>
                        </div>
                    )}
                    <button
                        className='btn btn-primary w-full sm:w-auto'
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
                        <span className='hidden sm:inline'>
                            {loading ? 'Обновление...' : 'Обновить данные'}
                        </span>
                        <span className='sm:hidden'>
                            {loading ? 'Обновление...' : 'Обновить'}
                        </span>
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
