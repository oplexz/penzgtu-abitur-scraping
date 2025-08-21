import type { Statistics as StatisticsType } from '../types/api';

interface StatisticsProps {
    statistics: StatisticsType | null;
}

export function Statistics({ statistics }: StatisticsProps) {
    if (!statistics) {
        return null;
    }

    // Calculate total available places from all directions
    const totalPlaces = Object.values(statistics.directions_stats).reduce(
        (sum, direction) => sum + (direction.available_places || 0),
        0
    );

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8'>
            <div className='card bg-base-200 shadow-md border border-base-300'>
                <div className='card-body p-4 sm:p-6'>
                    <div className='flex items-center gap-2'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                            />
                        </svg>
                        <h3 className='text-base sm:text-lg font-semibold'>
                            Направлений
                        </h3>
                    </div>
                    <div className='text-2xl sm:text-3xl font-bold'>
                        {statistics.total_directions}
                    </div>
                </div>
            </div>
            <div className='card bg-base-200 shadow-md border border-base-300'>
                <div className='card-body p-4 sm:p-6'>
                    <div className='flex items-center gap-2'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                            />
                        </svg>
                        <h3 className='text-base sm:text-lg font-semibold'>
                            Всего заявлений
                        </h3>
                    </div>
                    <div className='text-2xl sm:text-3xl font-bold'>
                        {statistics.total_applicants}
                    </div>
                </div>
            </div>
            <div className='card bg-base-200 shadow-md border border-base-300'>
                <div className='card-body p-4 sm:p-6'>
                    <div className='flex items-center gap-2'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                            />
                        </svg>
                        <h3 className='text-base sm:text-lg font-semibold'>
                            Уникальных лиц
                        </h3>
                    </div>
                    <div className='text-2xl sm:text-3xl font-bold'>
                        {statistics.unique_applicants_count}
                    </div>
                </div>
            </div>
            <div className='card bg-base-200 shadow-md border border-base-300'>
                <div className='card-body p-4 sm:p-6'>
                    <div className='flex items-center gap-2'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                            />
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                            />
                        </svg>
                        <h3 className='text-base sm:text-lg font-semibold'>
                            Всего мест
                        </h3>
                    </div>
                    <div className='text-2xl sm:text-3xl font-bold'>
                        {totalPlaces}
                    </div>
                </div>
            </div>
        </div>
    );
}
