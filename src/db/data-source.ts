import { typeOrmConfig } from './typeorm';
import { DataSource } from 'typeorm';

export default new DataSource(typeOrmConfig());
