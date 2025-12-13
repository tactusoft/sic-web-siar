import { Autoridad } from './autoridad';
import { Recurso } from './recurso';

export interface Pais {
    id: number;
    nombre: string;
    region: string;
    idioma: any;
    autoridades: Autoridad[];
    recursos: Array<Recurso>;
}
