// utils/jiraApiClient.ts
import axios, { AxiosResponse } from 'axios';
import debugLib from 'debug';
import {
  CreateIssuePayload,
  Issue,
  JiraErrorResponse,
  JiraSearchResponse,
  CreateIssueResponse,
} from 'api/utils/types/api-interfaces';

const debug = debugLib('jira:client');

const baseURL = process.env.JIRA_URL;
const authToken = process.env.JIRA_TOKEN;

if (!baseURL || !authToken) {
  throw new Error('JIRA_URL or JIRA_TOKEN environment variable is missing');
}

const api = axios.create({
  baseURL,
  headers: {
    Authorization: authToken,
    'Content-Type': 'application/json',
    'X-Atlassian-Token': 'no-check',
  },
  validateStatus: () => true,
});

export const JiraClient = {
  async getLatestIssue(): Promise<{ status: number; data: Issue }> {
    const response: AxiosResponse<JiraSearchResponse> = await api.get('/rest/api/3/search', {
      params: {
        jql: 'ORDER BY created DESC',
        maxResults: 1,
      },
    });
    const latestIssue = response.data.issues[0] || null;
    debug('Fetched latest issue:', latestIssue);
    return { status: response.status, data: latestIssue };
  },

  async getIssueById(
    issueId: string,
  ): Promise<{ status: number; data: Issue & JiraErrorResponse }> {
    const { data, status } = await api.get<Issue & JiraErrorResponse>(
      `/rest/api/2/issue/${issueId}`,
    );
    debug('Fetched issue:', data);
    return { status, data };
  },

  async createIssue(
    payload: CreateIssuePayload,
  ): Promise<{ status: number; data: CreateIssueResponse & JiraErrorResponse }> {
    const response: AxiosResponse<CreateIssueResponse & JiraErrorResponse> = await api.post(
      '/rest/api/3/issue',
      payload,
    );
    debug('Created issue:', response.data);
    return { status: response.status, data: response.data };
  },

  async deleteIssue(issueId: string): Promise<{ status: number; data: string }> {
    const response: AxiosResponse = await api.delete(`/rest/api/2/issue/${issueId}`);
    console.log(response);
    console.log(response.status);
    debug(`Deleted issue: ${issueId}`);
    return { status: response.status, data: response.statusText };
  },

  async updateIssue(
    issueId: string,
    updateData: CreateIssuePayload,
  ): Promise<{ status: number; data: string }> {
    const response: AxiosResponse = await api.put(`/rest/api/3/issue/${issueId}`, updateData);
    debug(`Updated issue: ${issueId}`, response.status, response.statusText);
    return { status: response.status, data: response.statusText };
  },
};
