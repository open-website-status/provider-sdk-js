export interface SDKOptions {
  token: string;
  server?: string;
  path?: string;
}

export type Job = {
  id: string,
  protocol: 'http' | 'https',
  host: string,
  path: string,
};

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
  executionTime: 'number';
}

export interface JobResultError {
  state: 'error';
  errorCode: string;
}

export type JobResult = JobResultSuccess | JobResultTimeout | JobResultError;
