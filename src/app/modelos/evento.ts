import { Pais } from './pais';
import { CategoryId } from './categoryId';
import { Recurso } from './recurso';

export interface Evento {
    id: number;
    title: string;
    summary: string;
    place: string;
    addres: string;
    categoryId: CategoryId;
    creationDate?: string;
    startDate: string;
    endDate: string;
    pais: Pais;
    recursos: Array<Recurso>;
}
