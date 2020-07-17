import io from 'socket.io-client';
import { Emitter } from './emitter';
import { Job, JobResult, SDKOptions } from './types';

export default class ProviderSDK extends Emitter<{
  connect: undefined,
  'dispatch-job': Job,
  'connect-error': Error,
  'connect-timeout': undefined,
  'error': string,
  'disconnect': undefined,
}> {
  public socket: SocketIOClient.Socket;

  public constructor(options: SDKOptions) {
    super();

    this.socket = io(options.server, {
      query: {
        token: options.token,
      },
      path: options.path ?? '/provider-socket',
    });

    this.socket.on('dispatch-job', (job: Job) => {
      this.emit('dispatch-job', job);
    });

    this.socket.on('connect', () => {
      this.emit('connect', undefined);
    });

    this.socket.on('connect_error', (error: Error) => {
      this.emit('connect-error', error);
    });

    this.socket.on('connect_timeout', () => {
      this.emit('connect-timeout', undefined);
    });

    this.socket.on('error', (errorMessage: string) => {
      this.emit('error', errorMessage);
    });

    this.socket.on('disconnect', () => {
      this.emit('disconnect', undefined);
    });
  }

  public accept(jobId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('accept-job', {
        jobId,
      }, (errorMessage: string | null) => {
        if (errorMessage !== null) {
          reject(new Error(errorMessage));
        } else {
          resolve();
        }
      });
    });
  }

  public reject(jobId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('reject-job', {
        jobId,
      }, (errorMessage: string | null) => {
        if (errorMessage !== null) {
          reject(new Error(errorMessage));
        } else {
          resolve();
        }
      });
    });
  }

  public complete(jobId: string, result: JobResult): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit('complete-job', {
        jobId,
        result,
      }, (errorMessage: string | null) => {
        if (errorMessage !== null) {
          reject(new Error(errorMessage));
        } else {
          resolve();
        }
      });
    });
  }
}
