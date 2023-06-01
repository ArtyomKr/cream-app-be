import IBackendError from '../models/errorModel';

function errorConstructor({
  status,
  message,
  err,
}: {
  status: number | undefined;
  message?: string;
  err?: unknown;
}): IBackendError {
  const messageRes =
    typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string'
      ? err.message
      : message ?? 'Unknown error occured';
  return { statusCode: status ?? 500, message: messageRes };
}

export default errorConstructor;
