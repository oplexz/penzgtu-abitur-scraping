import type { ApplicantSearchResponse } from '../types/api';

interface SearchResultWithError extends ApplicantSearchResponse {
    error?: string;
}

interface SearchDialogProps {
    isOpen: boolean;
    searchResult: SearchResultWithError | null;
    onClose: () => void;
}

export function SearchDialog({
    isOpen,
    searchResult,
    onClose,
}: SearchDialogProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className='modal-box max-w-4xl'>
                <h3 className='font-bold text-lg mb-4'>
                    Результаты поиска: {searchResult?.applicant_code}
                </h3>

                <div className='py-4'>
                    {searchResult &&
                        (searchResult.error ? (
                            <div role='alert' className='alert alert-error'>
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
                                <span>{searchResult.error}</span>
                            </div>
                        ) : (
                            <div>
                                <h4 className='text-lg font-semibold mb-4'>
                                    Найдено в {searchResult.found_in.length}{' '}
                                    направлении(ях):
                                </h4>
                                {searchResult.found_in
                                    .sort(
                                        (a, b) =>
                                            a.applicant.priority -
                                            b.applicant.priority
                                    )
                                    .map((result, index) => (
                                        <div
                                            key={index}
                                            className='card bg-base-200 shadow-sm border border-base-300 mb-3'
                                        >
                                            <div className='card-body p-4'>
                                                <h5 className='card-title text-base mb-2'>
                                                    {result.direction_code} -{' '}
                                                    {result.direction_name}
                                                </h5>
                                                <div className='flex flex-wrap gap-3 text-sm'>
                                                    <div className='flex items-center gap-1'>
                                                        <strong>
                                                            Согласие:
                                                        </strong>
                                                        <div
                                                            className={`badge ${
                                                                result.applicant
                                                                    .consent ===
                                                                'Есть'
                                                                    ? 'badge-success'
                                                                    : result
                                                                          .applicant
                                                                          .consent ===
                                                                      'Нет'
                                                                    ? 'badge-error'
                                                                    : 'badge-neutral'
                                                            } badge-xs`}
                                                        >
                                                            {
                                                                result.applicant
                                                                    .consent
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-1'>
                                                        <strong>
                                                            Приоритет:
                                                        </strong>
                                                        <span>
                                                            {
                                                                result.applicant
                                                                    .priority
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className='flex items-center gap-1'>
                                                        <strong>СД:</strong>
                                                        <span>
                                                            {
                                                                result.applicant
                                                                    .sd_score
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className='flex items-center gap-1'>
                                                        <strong>ИЯ:</strong>
                                                        <span>
                                                            {
                                                                result.applicant
                                                                    .lang_score
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                </div>

                <div className='modal-action'>
                    <button className='btn btn-primary' onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
            <form method='dialog' className='modal-backdrop'>
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
