import {SubdomainDTO} from '../clases/subdomainDTO';

export interface AtlasPlantilla {
  id: number;
  codigo: string;
  idPadre: number;
  tieneContenido: boolean;
  estado: string;
  subdominio: SubdomainDTO;
  posicion: number;
}
