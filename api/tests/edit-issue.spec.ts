import { test, expect } from '@playwright/test';
import debug from 'debug';
import { JiraClient } from '@api-client/jiraClient';
import { createSampleIssue } from 'api/utils/helper';
import { CreateIssuePayload } from 'api/utils/types/api-interfaces';

const log = debug('app:test:edit-issue');
let firstIssueId: string;
let updatedIssueData: CreateIssuePayload;

test.beforeAll(async () => {
  log('Fetching the latest issue...');
  const response = await JiraClient.getLatestIssue();
  expect(response.status).toBe(200);
  expect(response.data.id).not.toBeUndefined();
  firstIssueId = response.data.id;
  log(`Latest issue ID retrieved: ${firstIssueId}`);
});

test('Edit issue', async () => {
  log(`Editing issue with ID: ${firstIssueId}`);
  updatedIssueData = await createSampleIssue();
  log('Updated issue data:', updatedIssueData);
  const updatedIssue = await JiraClient.updateIssue(firstIssueId, updatedIssueData);
  log(`Issue updated with status: ${updatedIssue.status}`);
  expect(updatedIssue.status).toBe(204);
  expect(updatedIssue.data).toBe('No Content');
});
