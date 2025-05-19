export const enum WeatherApiErrorCode {
  LOCATION_NOT_FOUND = 1006,
  MISSED_PARAMETER = 1003,
}

export type BaseError = {
  error: {
    code: WeatherApiErrorCode;
    message: string;
  };
};

export const checkIsWeatherApiError = (error: unknown): error is BaseError =>
  (error as BaseError)?.error?.code !== undefined &&
  (error as BaseError)?.error?.message !== undefined;
