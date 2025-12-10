import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { GenericoService } from '../../../servicios/generico.service';
import { GestionProveedoresService } from '../gestion-proveedores.service';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../common/constants';
import { Pais } from '../../../modelos/pais';
import { LenguajeService } from '../../../servicios/lenguaje.service';
import { Proveedor } from 'src/app/modelos/proveedor';
import { Subdominio } from 'src/app/modelos/Subdominio';

@Component({
  selector: 'app-dialog-agregar',
  templateUrl: './dialog-agregar.component.html',
  styleUrls: ['./dialog-agregar.component.scss']
})
export class DialogAgregarComponent implements OnInit {

  registro: Proveedor;
  guardando = false;

  idRecord: number;
  titleField = new FormControl('', [Validators.required, Validators.maxLength(200)]);
  firmidField = new FormControl('', [Validators.required, Validators.maxLength(200)]);
  paisOrigenField = new FormControl('', [Validators.required]);
  countryHQField = new FormControl('', [Validators.maxLength(200)]);
  focusbusinessField = new FormControl('', [Validators.required, Validators.maxLength(200)]);
  acAddressField = new FormControl('', [Validators.maxLength(200)]);
  acCityField = new FormControl('', [Validators.maxLength(200)]);
  acStateField = new FormControl('', [Validators.maxLength(200)]);
  acPostalcodeField = new FormControl('', [Validators.maxLength(200)]);
  acPhoneField = new FormControl('', [Validators.maxLength(200)]);
  acCountryField = new FormControl('', [Validators.maxLength(200)]);
  acWebsiteField = new FormControl('', [Validators.maxLength(200)]);
  biParentnameField = new FormControl('', [Validators.maxLength(200)]);
  biSubsidiaryField = new FormControl('', [Validators.maxLength(200)]);
  clNameField = new FormControl('', [Validators.maxLength(200)]);
  clEmailField = new FormControl('', [Validators.maxLength(200)]);
  clPhoneField = new FormControl('', [Validators.maxLength(200)]);
  clExtensionField = new FormControl('', [Validators.maxLength(200)]);
  measure1Field = new FormControl('', [Validators.required]);
  measure2Field = new FormControl('', [Validators.required]);
  measure3Field = new FormControl('', [Validators.required]);
  measure4Field = new FormControl('', [Validators.required]);
  measure5Field = new FormControl('', [Validators.required]);
  measure6Field = new FormControl('', [Validators.required]);
  measure7Field = new FormControl('', [Validators.required]);

  measure1List: Array<any> = [];
  measure2List: Array<any> = [];
  measure3List: Array<any> = [];
  measure4List: Array<any> = [];
  measure5List: Array<any> = [];

  formEditar: FormGroup;
  NUMERO_ARCHIVOS = 10;
  NUMERO_IMAGENES = 5;

  enlacesC = new FormControl();
  intentoGuardar = false;
  paises: Pais[];

  form = new FormGroup({
    title: this.titleField,
    firmid: this.firmidField,
    focusbusiness: this.focusbusinessField,
    idCountry: this.paisOrigenField
  });
  idioma: number;
  textos: any = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private lenguajeService: LenguajeService,
              private toastr: ToastrService,
              private genericoService: GenericoService,
              public dialogRef: MatDialogRef<DialogAgregarComponent>,
              private gestionService: GestionProveedoresService
  ) {
    if (data) {
      this.registro = data;
      this.idRecord = this.registro.id;
      this.titleField.setValue(this.registro.title);
      this.firmidField.setValue(this.registro.firmid);
      this.focusbusinessField.setValue(this.registro.focusbusiness);
      this.acAddressField.setValue(this.registro.acAddress);
      this.acCityField.setValue(this.registro.acCity);
      this.acStateField.setValue(this.registro.acState);
      this.acPostalcodeField.setValue(this.registro.acPostalcode);
      this.acPhoneField.setValue(this.registro.acPhone);
      this.acWebsiteField.setValue(this.registro.acWebsite);
      this.biParentnameField.setValue(this.registro.biParentname);
      this.biSubsidiaryField.setValue(this.registro.biSubsidiary);
      this.clNameField.setValue(this.registro.clName);
      this.clEmailField.setValue(this.registro.clEmail);
      this.clPhoneField.setValue(this.registro.clPhone);
      this.clExtensionField.setValue(this.registro.clExtension);
      this.paisOrigenField.setValue(this.registro.idCountry);
      this.acCountryField.setValue(this.registro.idCountryParent);
      this.countryHQField.setValue(this.registro.idCountryHeadquarters);
      this.measure1Field.setValue(this.registro.idMeasure1);
      this.measure2Field.setValue(this.registro.idMeasure2);
      this.measure3Field.setValue(this.registro.idMeasure3);
      this.measure4Field.setValue(this.registro.idMeasure4);
      this.measure5Field.setValue(this.registro.idMeasure5);
      this.measure6Field.setValue(this.registro.idMeasure6);
      this.measure7Field.setValue(this.registro.idMeasure7);
    }
  }

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.textos = texts;
      },
        () => {
          this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.listarPaises();
    this.getDominios('Medida 1 Historial de Proveedores');
    this.getDominios('Medida 2 Historial de Proveedores');
    this.getDominios('Medida 3 Historial de Proveedores');
    this.getDominios('Medida 4 Historial de Proveedores');
    this.getDominios('Medida 5 Historial de Proveedores');
  }

  guardarClick(): void {
    this.intentoGuardar = true;
    this.titleField.setValue(this.titleField.value.trim());
    if (this.form.valid) {
      const url = Constants.PATH_GUARDAR_HIST_PROVEEDOR;
      const req = {
        id: this.idRecord,
        title: this.titleField.value,
        firmid: this.firmidField.value,
        focusbusiness: this.focusbusinessField.value,
        acAddress: this.acAddressField.value,
        acCity: this.acCityField.value,
        acState: this.acStateField.value,
        acPostalcode: this.acPostalcodeField.value,
        acPhone: this.acPhoneField.value,
        acWebsite: this.acWebsiteField.value,
        idCountry: this.paisOrigenField.value,
        idCountryParent: this.acCountryField.value,
        idCountryHeadquarters: this.countryHQField.value,
        clName: this.clNameField.value,
        clEmail: this.clEmailField.value,
        clPhone: this.clPhoneField.value,
        biParentname: this.biParentnameField.value,
        biSubsidiary: this.biSubsidiaryField.value,
        clExtension: this.clExtensionField.value,
        idMeasure1: this.measure1Field.value ? this.measure1Field.value : null,
        idMeasure2: this.measure2Field.value ? this.measure2Field.value : null,
        idMeasure3: this.measure3Field.value ? this.measure3Field.value : null,
        idMeasure4: this.measure4Field.value ? this.measure4Field.value : null,
        idMeasure5: this.measure5Field.value ? this.measure5Field.value : null,
        idMeasure6: this.measure6Field.value ? this.measure6Field.value : null,
        idMeasure7: this.measure7Field.value ? this.measure7Field.value : null,
        status: 'A'
      };
      this.genericoService.post(req, url).subscribe(res => {
        if (res.message === '200') {
          this.toastr.success(this.textos?.mensajes ? this.textos.mensajes.MSJ_OPE_REALIZADA : Constants.MSJ_OPE_REALIZADA);
          this.gestionService.recargarDocumentos.emit(true);
        } else {
          this.toastr.error(this.textos?.mensajes ? this.textos.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        }
        this.dialogRef.close();
      });
    }
  }

  listarPaises(): void {
    this.genericoService.get(`${Constants.PATH_LISTAR_PAIS_LANG}?pais=0&lang=${this.idioma}`).subscribe(res => {
      this.paises = res.data;
    });
  }

  getDominios(nombre: string): void {
    const url = `${Constants.PATH_LISTAR_DOMINIO_NOMBRE_LANG}?nombre=${nombre}&idioma=${this.idioma}`;
    this.genericoService.get(url).subscribe(res => {
      if (res.message === '200') {
        if (nombre === 'Medida 1 Historial de Proveedores') {
          this.measure1List = res.data.dominio[0].subDominio;
          this.measure1List.sort((a, b) => {
            if (a.description.toLowerCase().trim() > b.description.toLowerCase().trim()) {
              return 1;
            }
            if (a.description.toLowerCase().trim() < b.description.toLowerCase().trim()) {
              return -1;
            }
            return 0;
          });
        } else if (nombre === 'Medida 2 Historial de Proveedores') {
          this.measure2List = res.data.dominio[0].subDominio;
          this.measure2List.sort((a, b) => {
            if (a.description.toLowerCase().trim() > b.description.toLowerCase().trim()) {
              return 1;
            }
            if (a.description.toLowerCase().trim() < b.description.toLowerCase().trim()) {
              return -1;
            }
            return 0;
          });
        } else if (nombre === 'Medida 3 Historial de Proveedores') {
          this.measure3List = res.data.dominio[0].subDominio;
          this.measure3List.sort((a, b) => {
            if (a.description.toLowerCase().trim() > b.description.toLowerCase().trim()) {
              return 1;
            }
            if (a.description.toLowerCase().trim() < b.description.toLowerCase().trim()) {
              return -1;
            }
            return 0;
          });
        } else if (nombre === 'Medida 4 Historial de Proveedores') {
          this.measure4List = res.data.dominio[0].subDominio;
          this.measure4List.sort((a, b) => {
            if (a.description.toLowerCase().trim() > b.description.toLowerCase().trim()) {
              return 1;
            }
            if (a.description.toLowerCase().trim() < b.description.toLowerCase().trim()) {
              return -1;
            }
            return 0;
          });
        } else if (nombre === 'Medida 5 Historial de Proveedores') {
          this.measure5List = res.data.dominio[0].subDominio;
          this.measure5List.sort((a, b) => {
            if (a.description.toLowerCase().trim() > b.description.toLowerCase().trim()) {
              return 1;
            }
            if (a.description.toLowerCase().trim() < b.description.toLowerCase().trim()) {
              return -1;
            }
            return 0;
          });
        }
      }
    });
  }

  compareFnPais(x: Pais, y: Pais): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  compareFnMeasure(x: Subdominio, y: Subdominio): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  redirect(event): void {
    window.open(event, '_blank');
  }
}
