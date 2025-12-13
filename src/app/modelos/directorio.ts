import {Pais} from './pais';
import {CategoryId} from './categoryId';
import {Recurso} from './recurso';

export interface Directorio {
  id: number;
  agencia: string;
  contacto: string;
  cargo: string;
  direccion: string;
  estado: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
  fax: string;
  email: string;
  pais: Pais;
  categoryId: CategoryId;
  recursos: Array<Recurso>;
}
