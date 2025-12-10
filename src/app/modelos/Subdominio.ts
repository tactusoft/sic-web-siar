import {Dominio} from './dominio';

export interface Subdominio {
  id: number;
  description: string;
  order: number;
  idDominio: number;
  dominio: Dominio;
}
