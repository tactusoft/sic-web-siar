import { Subdominio } from './Subdominio';
export interface Recurso {
    id: number;
    path: string;
    tableName: string;
    tableId: number;
    resourceTypeId: Subdominio;
}
