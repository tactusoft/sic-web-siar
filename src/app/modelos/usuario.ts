import { Pais } from './pais';
import { Rol } from './rol';
import { Idioma } from './idioma';
export interface Usuario {
    id: number;
    name: string;
    last_name: string;
    email: string;
    password: string;
    pais: Pais;
    id_role: string;
    state: string;
    approved: boolean;
    idioma: Idioma;
    invitation_status: string;
    invitation_sent: Date;
    rol: Rol;
}
