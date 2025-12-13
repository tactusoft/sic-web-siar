import {DominioDTO} from './dominioDTO';
import {SubdomainLeng} from './subdomainLeng';

export class SubdomainDTO {

  id: number;
  name: string;
  description: string;
  orden: string;
  idDomain: number;
  dominio: DominioDTO;
  estado: string;
  subDominioLeng: SubdomainLeng;

  constructor() {


  }


}

export enum SubDomainID {
  Categoria = 1,
  NivelRiesgo = 2,
  Riesgos = 3,
  TipoMedida = 5,
  Proveedores = 6,
  CategoriaDirectorio = 14
}
