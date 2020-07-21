import io from 'socket.io-client';
import { EventEmitter } from 'typed-event-emitter';
import { Job, JobResult, SDKOptions } from './types';

export default class ProviderSDK extends EventEmitter {
  public onConnect = this.registerEvent<() => unknown>();

  public onDispatchJob = this.registerEvent<(job: Job) => unknown>();

  public onConnectError = this.registerEvent<(error: Error) => unknown>();

  public onConnectTimeout = this.registerEvent<() => unknown>();

  public onError = this.registerEvent<(error: string) => unknown>();

  public onDisconnect = this.registerEvent<() => unknown>();

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
      this.emit(this.onDispatchJob, job);
    });

    this.socket.on('connect', () => {
      this.emit(this.onConnect);
    });

    this.socket.on('connect_error', (error: Error) => {
      this.emit(this.onConnectError, error);
    });

    this.socket.on('connect_timeout', () => {
      this.emit(this.onConnectTimeout);
    });

    this.socket.on('error', (errorMessage: string) => {
      this.emit(this.onError, errorMessage);
    });

    this.socket.on('disconnect', () => {
      this.emit(this.onDisconnect);
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
