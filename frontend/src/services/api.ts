import axios, { type AxiosResponse } from 'axios';
import type {
    Config,
    ScrapingResponse,
    SessionsResponse,
    SessionData,
    ComparisonResult,
    ApplicantSearchResponse,
    Statistics,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || '';
const API_BASE_PATH = import.meta.env.VITE_BASE_PATH || '/';

// Construct the base URL by combining base URL with base path
const getBaseUrl = () => {
    if (!API_BASE_URL) return '';

    // Remove trailing slash from base URL and leading slash from base path if present
    const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '');
    const cleanBasePath = API_BASE_PATH.replace(/^\//, '').replace(/\/$/, '');

    return `${cleanBaseUrl}/${cleanBasePath}`;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    timeout: 30000,
});

export const apiService = {
    getConfig: (): Promise<AxiosResponse<Config>> => api.get('/api/config'),
    runScraping: (): Promise<AxiosResponse<ScrapingResponse>> =>
        api.post('/api/scrape'),
    getSessions: (): Promise<AxiosResponse<SessionsResponse>> =>
        api.get('/api/sessions'),
    getSession: (timestamp: string): Promise<AxiosResponse<SessionData>> =>
        api.get(`/api/sessions/${timestamp}`),
    getLatest: (): Promise<AxiosResponse<SessionData>> =>
        api.get('/api/latest'),
    compareSessions: (
        timestamp1: string,
        timestamp2: string
    ): Promise<AxiosResponse<ComparisonResult>> =>
        api.get(`/api/compare/${timestamp1}/${timestamp2}`),
    findApplicant: (
        code: string
    ): Promise<AxiosResponse<ApplicantSearchResponse>> =>
        api.get(`/api/applicant/${code}`),
    getStatistics: (): Promise<AxiosResponse<Statistics>> =>
        api.get('/api/statistics'),
};

export default api;
