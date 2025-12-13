export interface RegistroHomologacion {
    id?: number;
    idSiar?: number;
    externalField?: string;
    type?: string;
    idCountry?: number;
}

export enum TipoHomologacion {
    TipoC = 'C',
    TipoP = 'P'
}
