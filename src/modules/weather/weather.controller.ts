import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: () => {
        throw new BadRequestException('Invalid request');
      },
    }),
  )
  async getWeather(@Query() weatherDto: GetWeatherDto) {
    const { city } = weatherDto;

    // To prevent making the same request we can put results for example in Redis
    const weather = await this.weatherService.getWeather(city);

    return {
      temperature: weather?.current.temp_c,
      humidity: weather?.current.humidity,
      description: weather?.current.condition.text,
    };
  }
}
