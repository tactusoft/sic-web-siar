import {Pais} from './pais';

export interface Atlas {
  id: number;
  idTemplate: number;
  pais: Pais;
  contenido: string;
}
