import { DetalleSincronizacion } from './detalle-sincronizacion';

export interface AlertaSincronizacion{
    id?: number;
    description?: string;
    content: string;
    date?: string;
    status?: string;
    comment?: string;
    type?: string;
    resync?: boolean;
    detalleLog?: DetalleSincronizacion[];
}
