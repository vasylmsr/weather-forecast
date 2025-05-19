import { MinLength } from 'class-validator';

export class GetWeatherDto {
  @MinLength(1)
  city: string;
}
