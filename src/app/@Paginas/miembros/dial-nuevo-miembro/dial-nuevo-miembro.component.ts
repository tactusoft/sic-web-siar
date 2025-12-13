import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CabeceraService } from 'src/app/servicios/cabecera.service';
import { LenguajeService } from 'src/app/servicios/lenguaje.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Autoridad } from 'src/app/modelos/autoridad';
import { Miembro } from 'src/app/modelos/miembro';
import { Constants } from 'src/app/common/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GenericoService } from 'src/app/servicios/generico.service';
import { Pais } from 'src/app/modelos/pais';
import { Recurso } from 'src/app/modelos/recurso';

@Component({
  selector: 'app-dial-nuevo-miembro',
  templateUrl: './dial-nuevo-miembro.component.html',
  styleUrls: ['./dial-nuevo-miembro.component.scss']
})

export class DialNuevoMiembroComponent implements OnInit {
  user: FormGroup;
  formRegistro: FormGroup;
  miembroInfo: any = null;
  autoridades: Autoridad[];
  miembro: Miembro;
  iconoMas = Constants.ICON_MAS;
  imgFondo: any = [];
  imgBandera: any = [];
  imagenes: any = [];
  formEditar: FormGroup;
  NUMERO_IMAGENES = 1;
  submit = false;
  paises: Array<Pais>;
  idioma: number;
  editar = false;
  addAutoridad = 0;
  formu1 = false;
  formu2 = false;
  recursosActuales = 0;
  imagenesParaBorrar: Array<any> = [];
  subirfondo = false;
  subirBandera = false;
  administrar: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cabeceraService: CabeceraService,
    private lenguajeService: LenguajeService,
    private toastr: ToastrService,
    private genericoService: GenericoService,
    public dialogRef: MatDialogRef<DialNuevoMiembroComponent>,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cabeceraService.closeMenu.emit(true);
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = this.lenguajeService.devolverIntIdioma(data);
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(data).subscribe(texts => {
        this.miembroInfo = texts;
      },
        () => {
          this.toastr.error(this.miembroInfo?.mensajes ? this.miembroInfo?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });

    this.paises = this.data.paises;
    this.miembro = this.data.evento;
    this.administrar = this.data.administrar;
    this.builderForm();
  }

  builderForm(): void {
    this.miembro = this.data.miembro;
    if (!this.miembro) {
      this.subirfondo = true;
      this.subirBandera = true;
      this.formRegistro = new FormGroup({
        id: new FormControl(0),
        nombre: new FormControl(''),
        pais: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.minLength(2)]),
        contact: new FormControl('', [Validators.minLength(2)]),
        summary: new FormControl('', [Validators.minLength(2)]),
        email: new FormControl('', [Validators.pattern(Constants.PATTERN_EMAIL)]),
        address: new FormControl('', [Validators.minLength(2)]),
        state: new FormControl('', [Validators.minLength(2)]),
        city: new FormControl('', [Validators.minLength(2)]),
        phone: new FormControl('', [Validators.minLength(2)]),
        fax: new FormControl('', [Validators.minLength(2)]),
        idCountry: new FormControl('', [Validators.minLength(2)]),
        postalCode: new FormControl('', [Validators.minLength(2)]),
        position: new FormControl('', [Validators.minLength(2)]),
        webSite: new FormControl('', [Validators.minLength(2)]),
        name1: new FormControl('', [Validators.minLength(2)]),
        contact1: new FormControl('', [Validators.minLength(2)]),
        summary1: new FormControl('', [Validators.minLength(2)]),
        email1: new FormControl('', [Validators.pattern(Constants.PATTERN_EMAIL)]),
        address1: new FormControl('', [Validators.minLength(2)]),
        state1: new FormControl('', [Validators.minLength(2)]),
        city1: new FormControl('', [Validators.minLength(2)]),
        phone1: new FormControl('', [Validators.minLength(2)]),
        fax1: new FormControl('', [Validators.minLength(2)]),
        idCountry1: new FormControl(),
        postalCode1: new FormControl('', [Validators.minLength(2)]),
        position1: new FormControl('', [Validators.minLength(2)]),
        webSite1: new FormControl('', [Validators.minLength(2)]),
        name2: new FormControl('', [Validators.minLength(2)]),
        contact2: new FormControl('', [Validators.minLength(2)]),
        summary2: new FormControl('', [Validators.minLength(2)]),
        email2: new FormControl('', [Validators.pattern(Constants.PATTERN_EMAIL)]),
        address2: new FormControl('', [Validators.minLength(2)]),
        state2: new FormControl('', [Validators.minLength(2)]),
        city2: new FormControl('', [Validators.minLength(2)]),
        phone2: new FormControl('', [Validators.minLength(2)]),
        fax2: new FormControl('', [Validators.minLength(2)]),
        idCountry2: new FormControl(),
        postalCode2: new FormControl('', [Validators.minLength(2)]),
        position2: new FormControl('', [Validators.minLength(2)]),
        webSite2: new FormControl('', [Validators.minLength(2)])
      });
    } else {
      this.editar = true;
      const miembro: Miembro = this.data.miembro;
      this.subirfondo = false;
      this.subirBandera = false;
      if (miembro.autoridades[1] && miembro.autoridades[1].name){
        this.nuevaAutoridad(1);
      }
      if (miembro.autoridades[2] && miembro.autoridades[2].name){
        this.nuevaAutoridad(2);
      }

      this.formRegistro = new FormGroup({
        id: new FormControl(miembro.id),
        nombre: new FormControl(''),
        pais: new FormControl(miembro.id, [Validators.required]),
        name: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].name : '', [Validators.minLength(2)]),
        contact: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].contact : '', [Validators.minLength(2)]),
        summary: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].summary : '', [Validators.minLength(2)]),
        email: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].email : '', [Validators.pattern(Constants.PATTERN_EMAIL)]),
        address: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].address : '', [Validators.minLength(2)]),
        state: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].state : '', [Validators.minLength(2)]),
        city: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].city : '', [Validators.minLength(2)]),
        phone: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].phone : '', [Validators.minLength(2)]),
        fax: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].fax : '', [Validators.minLength(2)]),
        postalCode: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].postalCode : '', [Validators.minLength(2)]),
        position: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].position : '', [Validators.minLength(2)]),
        webSite: new FormControl(miembro.autoridades[0] ? miembro.autoridades[0].webSite : '', [Validators.minLength(2)]),
        name1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].name : '', [Validators.minLength(2)]),
        contact1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].contact : '', [Validators.minLength(2)]),
        summary1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].summary : '', [Validators.minLength(2)]),
        email1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].email : '', [Validators.pattern(Constants.PATTERN_EMAIL)]),
        address1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].address : '', [Validators.minLength(2)]),
        state1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].state : '', [Validators.minLength(2)]),
        city1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].city : '', [Validators.minLength(2)]),
        phone1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].phone : '', [Validators.minLength(2)]),
        fax1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].fax : '', [Validators.minLength(2)]),
        postalCode1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].postalCode : '', [Validators.minLength(2)]),
        position1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].position : '', [Validators.minLength(2)]),
        webSite1: new FormControl(miembro.autoridades[1] ? miembro.autoridades[1].webSite : '', [Validators.minLength(2)]),
        name2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].name : '', [Validators.minLength(2)]),
        contact2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].contact : '', [Validators.minLength(2)]),
        summary2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].summary : '', [Validators.minLength(2)]),
        email2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].email : '', [Validators.pattern(Constants.PATTERN_EMAIL)]),
        address2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].address : '', [Validators.minLength(2)]),
        state2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].state : '', [Validators.minLength(2)]),
        city2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].city : '', [Validators.minLength(2)]),
        phone2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].phone : '', [Validators.minLength(2)]),
        fax2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].fax : '', [Validators.minLength(2)]),
        postalCode2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].postalCode : '', [Validators.minLength(2)]),
        position2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].position : '', [Validators.minLength(2)]),
        webSite2: new FormControl(miembro.autoridades[2] ? miembro.autoridades[2].webSite : '', [Validators.minLength(2)]),
      });
    }
  }

  getImagenes(recurso: Array<Recurso>, tipo: string): Array<Recurso> {
    const rec = recurso.filter(r => r.resourceTypeId.description === tipo);
    this.recursosActuales = rec.length;
    return rec;
  }

  agregarImagenBorrar(imagen: any, tipo: string): void {
    if (tipo === 'fondo') {
      this.imagenesParaBorrar.push(imagen);
      const index = this.miembro.recursos.findIndex(r => r.id === imagen.id);
      this.miembro.recursos.splice(index, 1);
      this.recursosActuales = this.miembro.recursos.length;
      this.subirfondo = true;
      this.imgFondo = [];
    } else {
      this.imagenesParaBorrar.push(imagen);
      const index = this.miembro.recursos.findIndex(r => r.id === imagen.id);
      this.miembro.recursos.splice(index, 1);
      this.recursosActuales = this.miembro.recursos.length;
      this.subirBandera = true;
      this.imgBandera = [];
    }
  }

  get pais(): any {
    return this.formRegistro.get('pais');
  }
  get name(): any {
    return this.formRegistro.get('name');
  }
  get contact(): any {
    return this.formRegistro.get('contact');
  }
  get email(): any {
    return this.formRegistro.get('email');
  }
  get address(): any {
    return this.formRegistro.get('address');
  }
  get state(): any {
    return this.formRegistro.get('state');
  }
  get city(): any {
    return this.formRegistro.get('city');
  }
  get phone(): any {
    return this.formRegistro.get('phone');
  }
  get fax(): any {
    return this.formRegistro.get('fax');
  }
  get postalCode(): any {
    return this.formRegistro.get('postalCode');
  }
  get position(): any {
    return this.formRegistro.get('position');
  }
  get webSite(): any {
    return this.formRegistro.get('webSite');
  }
  get name1(): any {
    return this.formRegistro.get('name1');
  }
  get contact1(): any {
    return this.formRegistro.get('contact1');
  }
  get email1(): any {
    return this.formRegistro.get('email1');
  }
  get address1(): any {
    return this.formRegistro.get('address1');
  }
  get state1(): any {
    return this.formRegistro.get('state1');
  }
  get city1(): any {
    return this.formRegistro.get('city1');
  }
  get phone1(): any {
    return this.formRegistro.get('phone1');
  }
  get fax1(): any {
    return this.formRegistro.get('fax1');
  }
  get postalCode1(): any {
    return this.formRegistro.get('postalCode1');
  }
  get position1(): any {
    return this.formRegistro.get('position1');
  }
  get webSite1(): any {
    return this.formRegistro.get('webSite1');
  }

  get name2(): any {
    return this.formRegistro.get('name2');
  }
  get contact2(): any {
    return this.formRegistro.get('contact2');
  }
  get email2(): any {
    return this.formRegistro.get('email2');
  }
  get address2(): any {
    return this.formRegistro.get('address2');
  }
  get state2(): any {
    return this.formRegistro.get('state2');
  }
  get city2(): any {
    return this.formRegistro.get('city2');
  }
  get phone2(): any {
    return this.formRegistro.get('phone2');
  }
  get fax2(): any {
    return this.formRegistro.get('fax2');
  }
  get postalCode2(): any {
    return this.formRegistro.get('postalCode2');
  }
  get position2(): any {
    return this.formRegistro.get('position2');
  }
  get webSite2(): any {
    return this.formRegistro.get('webSite2');
  }



  limpiarInput(input: any): void {
    input.setValue('');
  }

  handleImagenInput(files: any): void {
    const formatos = ['png', 'gif', 'jpg', 'jpeg'];
    const pesoMax = 5000000;
    for (const file1 of files) {
      if (file1.size > pesoMax) {
        this.toastr.warning(this.miembroInfo?.mensajes ? this.miembroInfo.mensajes.MSJ_PESO_MAXIMO : Constants.MSJ_PESO_MAXIMO);
        return;
      }
    }

    for (const file1 of files) {
      const name = file1.name.slice(file1.name.lastIndexOf('.') + 1, file1.name.length);
      const esta = formatos.includes(name.toLowerCase());
      if (!esta) {
        this.toastr.warning(this.miembroInfo?.mensajes
          ? this.miembroInfo.mensajes.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
        return;
      }
    }

    if ((files.length + this.imgFondo.length) > this.NUMERO_IMAGENES) {
      this.toastr.info(this.miembroInfo?.mensajes ? this.miembroInfo.mensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
      return;
    }
    for (const file1 of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageStr = e.target.result;
        const multimedia = {
          extension: file1.type.trim().toString(),
          nombre: file1.name,
          tamano: file1.size,
          tipo: 'fondo',
          base64: imageStr.split(':')[1]
        };
        this.imgFondo.push(multimedia);
        this.subirfondo = false;
      };
      reader.readAsDataURL(file1);
    }
  }

  openImagenExplorer(): void {
    if (this.imgFondo.length < this.NUMERO_IMAGENES) {
      const input: HTMLElement = document.getElementById('imgFondo') as HTMLElement;
      input.click();
    } else {
      this.toastr.info(this.miembroInfo?.mensajes ? this.miembroInfo.mensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
    }
  }

  eliminarImagen(arch: any): void {
    const indx = this.imgFondo.map(res => res.nombre).indexOf(arch.nombre);
    this.imgFondo.splice(indx, 1);
    this.imgFondo = [];
    this.subirfondo = true;
  }

  handleImagenInputBandera(files: any): void {
    const formatos = ['png', 'gif', 'jpg', 'jpeg'];
    const pesoMax = 5000000;
    for (const file1 of files) {
      if (file1.size > pesoMax) {
        this.toastr.warning(this.miembroInfo?.mensajes ? this.miembroInfo.mensajes.MSJ_PESO_MAXIMO : Constants.MSJ_PESO_MAXIMO);
        return;
      }
    }

    for (const file1 of files) {
      const name = file1.name.slice(file1.name.lastIndexOf('.') + 1, file1.name.length);
      const esta = formatos.includes(name.toLowerCase());
      if (!esta) {
        this.toastr.warning(this.miembroInfo?.mensajes
          ? this.miembroInfo.mensajes.FORMATO_DOCUMENTOS_INVALIDO : Constants.FORMATO_DOCUMENTOS_INVALIDO);
        return;
      }
    }

    if ((files.length + this.imgBandera.length) > this.NUMERO_IMAGENES) {
      this.toastr.info(this.miembroInfo?.mensajes ? this.miembroInfo.mensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
      return;
    }
    for (const file1 of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageStr = e.target.result;
        const multimedia = {
          extension: file1.type.trim().toString(),
          nombre: file1.name,
          tamano: file1.size,
          tipo: 'bandera',
          base64: imageStr.split(':')[1]
        };
        this.imgBandera.push(multimedia);
        this.subirBandera = false;
      };
      reader.readAsDataURL(file1);
    }
  }

  openImagenExplorerBandera(): void {
    if (this.imgBandera.length < this.NUMERO_IMAGENES) {
      const input: HTMLElement = document.getElementById('imgBandera') as HTMLElement;
      input.click();
    } else {
      this.toastr.info(this.miembroInfo?.mensajes ? this.miembroInfo.mensajes.MSJ_MAXIMO_ARCHIVOS : Constants.MSJ_MAXIMO_ARCHIVOS);
    }
  }

  eliminarImagenBandera(arch: any): void {
    const indx = this.imgBandera.map(res => res.nombre).indexOf(arch.nombre);
    this.imgBandera.splice(indx, 1);
    this.subirBandera = true;
    this.imgBandera = [];
  }

  nuevaAutoridad(formu: number): void {
    if (formu === 1) {
      this.formu1 = true;
    }
    if (formu === 2) {
      this.formu2 = true;
    }
  }

  guardarUsuario(datas: any): void {
    if (this.subirBandera || this.subirfondo){
      this.toastr.warning(this.miembroInfo.miembros.validarImagenes);
    }
    else {
      this.submit = true;
      if (this.formRegistro.valid) {
        const autoridades = new Array();
        if (datas.name) {
          const autoridad1: Autoridad = {
            id: null,
            name: datas.name,
            contact: datas.contact,
            summary: datas.summary,
            email: datas.email,
            address: datas.address,
            state: datas.state,
            city: datas.city,
            phone: datas.phone,
            fax: datas.fax,
            idCountry: datas.pais,
            postalCode: datas.postalCode,
            position: datas.position,
            webSite: datas.webSite
          };
          autoridades.push(autoridad1);
        }

        if (datas.name1) {
          const autoridad2: Autoridad = {
            id: null,
            name: datas.name1,
            contact: datas.contact1,
            summary: datas.summary1,
            email: datas.email1,
            address: datas.address1,
            state: datas.state1,
            city: datas.city1,
            phone: datas.phone1,
            fax: datas.fax1,
            idCountry: datas.pais,
            postalCode: datas.postalCode1,
            position: datas.position1,
            webSite: datas.webSite1
          };
          autoridades.push(autoridad2);
        }

        if (datas.name2) {
          const autoridad3: Autoridad = {
            id: null,
            name: datas.name2,
            contact: datas.contact2,
            summary: datas.summary2,
            email: datas.email2,
            address: datas.address2,
            state: datas.state2,
            city: datas.city2,
            phone: datas.phone2,
            fax: datas.fax2,
            idCountry: datas.pais,
            postalCode: datas.postalCode2,
            position: datas.position2,
            webSite: datas.webSite2
          };
          autoridades.push(autoridad3);
        }

        this.imagenes = [];
        if (typeof this.imgBandera[0] !== 'undefined'){
          this.imagenes.push(this.imgBandera[0]);
        }

        if (typeof this.imgFondo[0] !== 'undefined'){
          this.imagenes.push(this.imgFondo[0]);
        }

        const body = {
          id: datas.pais,
          nombre: '',
          region: '',
          autoridades,
          imagenes: this.imagenes,
          idioma: { id: this.idioma },
          miembro: true
        };

        if (this.editar) {
          this.genericoService.put(body, '/gestion/pais/editarMiembro').subscribe(
            res => {
              if (res.message === '200') {
                this.dialogRef.close(true);
              }
            });
        } else {
          const url = `/gestion/pais/guardarMiembro`;
          this.genericoService.post(body, url).subscribe(
            res => {
              if (res.message === '200') {
                this.dialogRef.close(true);
              } else {
                this.toastr.error(this.miembroInfo?.mensajes ? this.miembroInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
              }
            },
            error => {
              console.error(error);
              this.toastr.error(this.miembroInfo?.mensajes ? this.miembroInfo.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
            }
          );
        }
      }
    }
  }
}
