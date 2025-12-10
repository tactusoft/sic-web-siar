import {SubdomainDTO} from './subdomainDTO';

export interface PlantillaAtlasDTO {
  id: number;
  codigo: string;
  idPadre: number;
  tieneContenido: boolean;
  estado: string;
  posicion: number;
  subdominio: SubdomainDTO;
  enunciadoEsp: string;
  enunciadoEng: string;
  enunciadoPor: string;
  enunciadoFra: string;
}
