import { test, expect } from '@playwright/test';
import debug from 'debug';

import { JiraClient } from '@api-client/jiraClient';
import { createSampleIssue } from 'api/utils/helper';

const log = debug('app:test:create-issue');

test('Should create a new Jira issue successfully', async () => {
  log('Preparing sample issue payload...');
  const issuePayload = await createSampleIssue();
  log('Sending request to create issue...');
  const newIssue = await JiraClient.createIssue(issuePayload);
  expect(newIssue).not.toBeNull();
  log(`Issue created with ID: ${newIssue.data.id}`);
  expect(newIssue.status).toBe(201);
  expect(newIssue.data).toHaveProperty('id');
  expect(typeof newIssue.data.id).toBe('string');
});
