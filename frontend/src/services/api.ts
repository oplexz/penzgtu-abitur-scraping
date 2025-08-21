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

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
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
