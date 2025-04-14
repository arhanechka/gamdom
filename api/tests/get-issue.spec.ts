import { test, expect } from '@playwright/test';
import debug from 'debug';
import { JiraClient } from '@api-client/jiraClient';

const log = debug('app:test:get-issue');

let firstIssueId: string;

test.beforeAll(async () => {
  try {
    log('Fetching the latest issue...');
    const response = await JiraClient.getLatestIssue();
    expect(response.status).toBe(200);
    expect(response.data.id).not.toBeUndefined();
    firstIssueId = response.data.id;
    log(`Latest issue ID retrieved: ${firstIssueId}`);
  } catch (error) {
    log('Error fetching latest issue:', error);
    throw new Error('Failed to fetch the latest issue');
  }
});

test('GET issue by ID', async () => {
  log(`Fetching issue with ID: ${firstIssueId}`);
  const issue = await JiraClient.getIssueById(firstIssueId);
  expect(issue.status).toBe(200);
  expect(issue.data.id).not.toBeUndefined();
  expect(issue.data.id).toBe(firstIssueId);
  log(`Successfully fetched issue with ID: ${issue.data.id}`);
});
