export interface SDKOptions {
  token: string;
  server: string;
  path?: string;
}

export interface Job {
  jobId: string,
  queryId: string,
  protocol: 'http:' | 'https:',
  hostname: string,
  pathname: string,
  port: number | undefined,
  search: string,
}

export interface JobResultSuccess {
  state: 'success';
  httpCode: number;
  /**
   * Execution time in milliseconds
   */
  executionTime: number;
}

export interface JobResultTimeout {
  state: 'timeout';
  executionTime: number;
}

export interface JobResultError {
  state: 'error';
  errorCode: string;
}

export type JobResult = JobResultSuccess | JobResultTimeout | JobResultError;
