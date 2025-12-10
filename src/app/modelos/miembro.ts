import { Autoridad } from './autoridad';
import { Recurso } from './recurso';

export interface Miembro {
    id: number;
    nombre: string;
    region: string;
    autoridades: Array<Autoridad>;
    recursos: Array<Recurso>;
}
