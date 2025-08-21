export interface Applicant {
    position: number;
    unique_code: string;
    consent: string;
    sd_score: string;
    lang_score: string;
    achievements: string;
    additional: string;
    priority: number;
    total_score: string;
}

export interface Direction {
    direction_id: string;
    direction_code: string;
    direction_name: string;
    url: string;
    name?: string;
    total_applications?: number;
    available_places?: number;
    form?: string;
    funding_type?: string;
    applicants: Applicant[];
    scraped_at: string;
    error?: string;
}

export interface SessionData {
    timestamp: string;
    total_directions: number;
    directions: Record<string, Direction>;
}

export interface DirectionConfig {
    id: string;
    name: string;
    url: string;
    code: string;
}

export interface Config {
    directions: DirectionConfig[];
}

export interface SessionInfo {
    filename: string;
    timestamp: string;
    path: string;
}

export interface SessionsResponse {
    sessions: SessionInfo[];
    total: number;
}

export interface ComparisonResult {
    timestamp1: string;
    timestamp2: string;
    directions: Record<
        string,
        {
            direction_name: string;
            total_before: number;
            total_after: number;
            new_applicants: string[];
            removed_applicants: string[];
            change: number;
        }
    >;
}

export interface ApplicantSearchResult {
    direction_id: string;
    direction_name: string;
    direction_code: string;
    applicant: Applicant;
}

export interface ApplicantSearchResponse {
    applicant_code: string;
    found_in: ApplicantSearchResult[];
}

export interface DirectionStats {
    name: string;
    code: string;
    total_applications: number;
    available_places: number;
    with_consent: number;
    without_consent: number;
}

export interface Statistics {
    timestamp: string;
    total_directions: number;
    total_applicants: number;
    unique_applicants_count: number;
    unique_applicants: string[];
    directions_stats: Record<string, DirectionStats>;
}

export interface ScrapingResponse {
    message: string;
    filepath: string;
    timestamp: string;
}
