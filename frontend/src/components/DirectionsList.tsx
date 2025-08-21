import { useState } from 'react';
import type { SessionData, Applicant } from '../types/api';
import { pluralizeDirections } from '../utils/pluralize';

type SortType = 'applicationNumber' | 'applicationCount' | 'priority';

interface DirectionsListProps {
    data: SessionData | null;
    onApplicantClick?: (code: string) => void;
}

export function DirectionsList({
    data,
    onApplicantClick,
}: DirectionsListProps) {
    const [sortTypes, setSortTypes] = useState<Record<string, SortType>>({});

    if (!data || !data.directions) {
        return null;
    }

    const getApplicantDirectionsCount = (uniqueCode: string): number => {
        if (!data?.directions) return 0;

        let count = 0;
        Object.values(data.directions).forEach((direction) => {
            if (
                direction.applicants?.some(
                    (applicant) => applicant.unique_code === uniqueCode
                )
            ) {
                count++;
            }
        });
        return count;
    };

    const sortApplicants = (
        applicants: Applicant[],
        sortType: SortType
    ): Applicant[] => {
        const sorted = [...applicants];

        switch (sortType) {
            case 'applicationNumber':
                return sorted.sort((a, b) => a.position - b.position);
            case 'applicationCount':
                return sorted.sort((a, b) => {
                    const countA = getApplicantDirectionsCount(a.unique_code);
                    const countB = getApplicantDirectionsCount(b.unique_code);
                    return countB - countA; // Descending order
                });
            case 'priority':
                return sorted.sort((a, b) => a.priority - b.priority);
            default:
                return sorted;
        }
    };

    const getSortedApplicants = (
        directionId: string,
        applicants: Applicant[]
    ): Applicant[] => {
        const sortType = sortTypes[directionId] || 'applicationNumber';
        return sortApplicants(applicants, sortType);
    };

    const handleSortChange = (directionId: string, sortType: SortType) => {
        setSortTypes((prev) => ({
            ...prev,
            [directionId]: sortType,
        }));
    };

    const getSortButtonClass = (
        directionId: string,
        sortType: SortType
    ): string => {
        const currentSort = sortTypes[directionId] || 'applicationNumber';
        return currentSort === sortType
            ? 'btn btn-primary btn-xs'
            : 'btn btn-outline btn-xs';
    };

    return (
        <div>
            <h2 className='text-3xl font-bold mb-6'>Направления подготовки</h2>

            {Object.entries(data.directions).map(
                ([directionId, directionData]) => (
                    <div
                        key={directionId}
                        className='collapse collapse-arrow bg-base-200 border border-base-300 mb-4'
                    >
                        <input type='checkbox' className='collapse-checkbox' />
                        <div className='collapse-title'>
                            <div className='w-full'>
                                <h3 className='text-lg font-semibold'>
                                    {directionData.direction_code} -{' '}
                                    {directionData.direction_name}
                                </h3>
                                <div className='flex flex-wrap gap-2 mt-2'>
                                    <div className='badge badge-neutral'>
                                        Заявлений:{' '}
                                        {directionData.applicants?.length || 0}
                                    </div>
                                    {directionData.available_places && (
                                        <div className='badge badge-primary'>
                                            Мест:{' '}
                                            {directionData.available_places}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='collapse-content'>
                            {directionData.applicants &&
                            directionData.applicants.length > 0 ? (
                                <div>
                                    <div className='mb-4 flex flex-wrap gap-2 items-center'>
                                        <span className='text-sm font-medium'>
                                            Сортировка:
                                        </span>
                                        <button
                                            className={getSortButtonClass(
                                                directionId,
                                                'applicationNumber'
                                            )}
                                            onClick={() =>
                                                handleSortChange(
                                                    directionId,
                                                    'applicationNumber'
                                                )
                                            }
                                        >
                                            По номеру заявления
                                        </button>
                                        <button
                                            className={getSortButtonClass(
                                                directionId,
                                                'applicationCount'
                                            )}
                                            onClick={() =>
                                                handleSortChange(
                                                    directionId,
                                                    'applicationCount'
                                                )
                                            }
                                        >
                                            По кол-ву заявлений абитуриента
                                        </button>
                                        <button
                                            className={getSortButtonClass(
                                                directionId,
                                                'priority'
                                            )}
                                            onClick={() =>
                                                handleSortChange(
                                                    directionId,
                                                    'priority'
                                                )
                                            }
                                        >
                                            По приоритету
                                        </button>
                                    </div>
                                    <div className='overflow-x-auto'>
                                        <table className='table table-sm table-zebra'>
                                            <thead>
                                                <tr>
                                                    <th>№</th>
                                                    <th>Код</th>
                                                    <th>Согласие</th>
                                                    <th>СД</th>
                                                    <th>ИЯ</th>
                                                    <th>ИД</th>
                                                    <th>Приоритет</th>
                                                    <th>Сумма</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getSortedApplicants(
                                                    directionId,
                                                    directionData.applicants
                                                ).map((applicant, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {applicant.position}
                                                        </td>
                                                        <td>
                                                            <div className='flex flex-col gap-1'>
                                                                <button
                                                                    className='text-sm font-mono text-primary hover:text-primary-focus cursor-pointer underline text-left'
                                                                    onClick={() =>
                                                                        onApplicantClick?.(
                                                                            applicant.unique_code
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        applicant.unique_code
                                                                    }
                                                                </button>
                                                                <div className='text-xs text-base-content/60'>
                                                                    {getApplicantDirectionsCount(
                                                                        applicant.unique_code
                                                                    )}{' '}
                                                                    {pluralizeDirections(
                                                                        getApplicantDirectionsCount(
                                                                            applicant.unique_code
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div
                                                                className={`badge ${
                                                                    applicant.consent ===
                                                                    'Есть'
                                                                        ? 'badge-success'
                                                                        : applicant.consent ===
                                                                          'Нет'
                                                                        ? 'badge-error'
                                                                        : 'badge-neutral'
                                                                } badge-sm`}
                                                            >
                                                                {
                                                                    applicant.consent
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {applicant.sd_score}
                                                        </td>
                                                        <td>
                                                            {
                                                                applicant.lang_score
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                applicant.achievements
                                                            }
                                                        </td>
                                                        <td>
                                                            {applicant.priority}
                                                        </td>
                                                        <td>
                                                            {
                                                                applicant.total_score
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <p className='text-center text-base-content/70 py-4'>
                                    Нет данных об абитуриентах
                                </p>
                            )}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
