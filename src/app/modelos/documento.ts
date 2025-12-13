import { Pais } from './pais';
import { Recurso } from './recurso';
import { Categoria } from './categoria';

export interface Documento{
    id: number;
    title: string;
    summary: string;
    state: string;
    paises: Pais[];
    recursos: Recurso[];
    categorias: Categoria[];

}
