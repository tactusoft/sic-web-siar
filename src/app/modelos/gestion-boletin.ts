import {Boletin} from './boletin';
import {Recurso} from './recurso';

export interface GestionBoletin {
    boletin: Boletin;
    recursos: Array<Recurso>;
    base64: string;
}
