import { CreateIssuePayload } from './types/api-interfaces';
export const generateRandomSummary = () => `Random Issue ${Math.floor(Math.random() * 10000)}`;
export const generateRandomDescription = () =>
  `Random Description ${Math.floor(Math.random() * 10000)}`;

export async function createSampleIssue() {
  const payload: CreateIssuePayload = {
    fields: {
      project: {
        key: 'QA',
      },
      summary: generateRandomSummary(),
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                text: generateRandomDescription(),
                type: 'text',
              },
            ],
          },
        ],
      },
      issuetype: {
        name: 'Task',
      },
    },
  };
  return payload;
}
