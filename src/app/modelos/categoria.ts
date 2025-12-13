import {Domain} from './domain';

export interface Categoria {
  id: number;
  description: string;
  order: number;
  domain: Domain;
}
