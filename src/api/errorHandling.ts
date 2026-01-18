export type ApiErrorResponse = {
  error?: string;
  message?: string;
  details?: string;
};

export const parseApiError = async (
  response: Response,
  defaultMessage: string
): Promise<Error> => {
  if (response.status === 400) {
    const error: ApiErrorResponse = await response.json();
    return new Error(error.details || error.message || defaultMessage);
  }

  if (response.status === 404) {
    const error: ApiErrorResponse = await response.json();
    return new Error(error?.error || error.message || defaultMessage);
  }

  const errorText = response.statusText || defaultMessage;
  return new Error(errorText);
};

