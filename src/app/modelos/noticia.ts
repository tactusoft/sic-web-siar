import { Pais } from './pais';
import { Recurso } from './recurso';
export interface Noticia {
    id: number;
    titulo: string;
    resumen: string;
    enlaces: string;
    fecha: Date;
    miniatura: string;
    pais: Array<Pais>;
    recursos: Array<Recurso>;
}
