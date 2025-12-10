import { RecursoDto } from './recursos-dto';
export interface FolderDto {
    id: number;
    nombre: string;
    fecha: string;
    recursos: RecursoDto;
}
