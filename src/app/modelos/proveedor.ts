import { Pais } from './pais';

export interface Proveedor {
  id: number;
  title: string;
  firmid: string;
  focusbusiness: string;
  acAddress: string;
  acCity: string;
  acState: string;
  acPostalcode: string;
  acPhone: string;
  acWebsite: string;
  clName: string;
  clEmail: string;
  clPhone: string;
  clExtension: string;
  biParentname: string;
  biSubsidiary: string;
  status: string;

  idMeasure1: any;
  idMeasure2: any;
  idMeasure3: any;
  idMeasure4: any;
  idMeasure5: any;
  idMeasure6: any;
  idMeasure7: any;

  idCountry: Pais;
  idCountryParent: Pais;
  idCountryHeadquarters: Pais;
}
