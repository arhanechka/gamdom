import { test, expect } from '@playwright/test';
import debug from 'debug';
import { JiraClient } from '@api-client/jiraClient';

const log = debug('app:test:delete-issue');
let createdIssueId: string;

test.beforeAll(async () => {
  log('Fetching the latest issue...');
  try {
    const response = await JiraClient.getLatestIssue();
    expect(response).not.toBeNull();
    expect(response.status).toBe(200);
    expect(response.data.id).not.toBeUndefined();
    createdIssueId = response.data.id;
    log(`Latest issue ID retrieved: ${createdIssueId}`);
  } catch (error) {
    log('Error fetching the latest issue:', error);
    throw new Error('Failed to fetch the latest issue.');
  }
});

test('Delete created issue', async () => {
  log(`Deleting issue with ID: ${createdIssueId}...`);
  const response = await JiraClient.deleteIssue(createdIssueId);
  log(`Issue with ID ${createdIssueId} has been deleted.`);
  expect(response.status).toBe(204);
  expect(response.data).toBe('No Content');
});
