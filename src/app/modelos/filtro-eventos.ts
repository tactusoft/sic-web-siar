import { FiltroEstadoEvento } from './filtro-estado-evento';
import { FiltroPais } from './filtro-pais';
export interface FiltroEventos {
    paises: Array<FiltroPais>;
    estados: Array<FiltroEstadoEvento>;
}
