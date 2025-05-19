import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { WeatherApiDTO } from './dto/weather-api-forecast.dto';
import { firstValueFrom } from 'rxjs';
import {
  checkIsWeatherApiError,
  WeatherApiErrorCode,
} from './dto/weather-api-error.dto';
import { CityNotFoundException } from './exceptions/city-not-found.exception';
import { AxiosError, isAxiosError } from 'axios';

@Injectable()
export class WeatherService {
  baseUrl = 'http://api.weatherapi.com/v1';
  WEATHER_API_KEY = '';

  constructor(private readonly httpService: HttpService) {
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    if (!WEATHER_API_KEY) {
      throw new Error('WEATHER_API_KEY is required but not found!');
    }

    this.WEATHER_API_KEY = WEATHER_API_KEY;
  }

  async getWeather(city: string) {
    const URL = `${this.baseUrl}/current.json`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<WeatherApiDTO>(URL, {
          params: {
            key: this.WEATHER_API_KEY,
            q: city,
          },
        }),
      );

      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const apiError = error.response?.data as unknown as AxiosError;

        if (checkIsWeatherApiError(apiError)) {
          if (apiError.error.code === WeatherApiErrorCode.LOCATION_NOT_FOUND) {
            throw new CityNotFoundException();
          } else {
            throw new BadRequestException('Invalid request');
          }
        }
      }

      throw error;
    }
  }
}
