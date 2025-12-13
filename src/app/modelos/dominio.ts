import { Subdominio } from './Subdominio';

export interface Dominio {
    id: number;
    nombre: string;
    subDominio: Array<Subdominio>;
}
