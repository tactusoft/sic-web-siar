import { Comentario } from './comentario';
import { Recurso } from './recurso';
export class CursosTalleres {
    comentarios: Array<Comentario>;
    country: any;
    endDate: Date;
    id: number;
    name: string;
    place: string;
    recursos: Array<Recurso>;
    startDate: Date;
    state: string;
    type: any;
    enlaces: Array<string> = [];
    multimedia: Array<RecursosMultimedia> = [];
    constructor() {
    }

}


export class RecursosMultimedia {
    id: number;
    path: string;
    tipoMultimedia: string;
    nombreRecurso: string;
    base64: string;
    tipoContenido: string;
    constructor() {
    }


}
