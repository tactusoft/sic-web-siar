import { Subdominio } from './Subdominio';
export interface CategoryId{
    id: number;
    name: string;
    description?: string;
    subDominio: Array<Subdominio>;
}
