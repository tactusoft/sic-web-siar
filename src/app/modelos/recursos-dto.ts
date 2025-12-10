import { Subdominio } from './Subdominio';
export interface RecursoDto {
    id: number;
    path: string;
    tableName: string;
    tableId: number;
    size: string;
    date: string;
    resourceTypeId: Subdominio;
}
