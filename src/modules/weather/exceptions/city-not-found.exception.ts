import { HttpException, HttpStatus } from '@nestjs/common';

export class CityNotFoundException extends HttpException {
  constructor() {
    super('City not found', HttpStatus.NOT_FOUND);
  }
}
