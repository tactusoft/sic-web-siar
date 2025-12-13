import { Pais } from './pais';
import { Recurso } from './recurso';

export interface Alerta {
    accidentsReported: string;
    additionalInformation: string;
    batchNumberBarcode: string;
    categoryId: {
        id: number;
        name: string;
    };
    contentLanguageId: number;
    defectDescription: string;
    distributor: string;
    id: number;
    importer: string;
    manufacturerer: string;
    measureTypeId: any;
    measures: string;
    idCountry: Pais;
    nombre: string;
    region: string;
    periodSold: string;
    productBrand: string;
    productDescription: string;
    productName: string;
    productOriginCountry: any;
    sourceCountry: any;
    publicationDate: Date;
    creationDate: Date;
    modificationDate: Date;
    creationUser: any;
    modificationUser: any;
    recommendationsWarnings: string;
    typeNumberModel: string;
    units: number;
    riesgo: any;
    nivelRiesgo: any;
    urlSource: string;
    proveedor: any;
    recursos: Array<Recurso>;
}
