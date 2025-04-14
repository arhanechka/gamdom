export interface Issue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string;
    project: {
      key: string;
    };
    issuetype: {
      name: string;
    };
  };
}

export interface JiraErrorResponse {
  errorMessages: string[];
  errors: Record<string, string>;
}

export interface CreateIssuePayload {
  fields: {
    project: {
      key: string;
    };
    summary: string;
    description: {
      type: 'doc';
      version: number;
      content: {
        type: 'paragraph';
        content: {
          text: string;
          type: 'text';
        }[];
      }[];
    };
    issuetype: {
      name: string;
    };
  };
}
export interface JiraSearchResponse {
  issues: Issue[];
  maxResults: number;
  total: number;
  startAt: number;
}

export interface CreateIssueResponse {
  id: string;
  key: string;
  self: string;
}
