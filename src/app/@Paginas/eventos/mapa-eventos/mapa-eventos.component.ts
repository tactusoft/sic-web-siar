import { Component, Input, OnInit } from '@angular/core';
import { MapaService } from '../../../servicios/mapa/mapa.service';
import {Constants} from '../../../common/constants';
import { ToastrService } from 'ngx-toastr';
import {LenguajeService} from '../../../servicios/lenguaje.service';

declare var ol: any;

@Component({
  selector: 'app-mapa-eventos',
  templateUrl: './mapa-eventos.component.html',
  styleUrls: ['./mapa-eventos.component.scss']
})
export class MapaEventosComponent implements OnInit {

  idioma: string;
  textos: any = null;

  constructor(
    private mapaService: MapaService,
    private lenguajeService: LenguajeService,
    private toastrService: ToastrService
  ) { }

  public map: any;
  @Input() descripcion;
  @Input() direccion;
  @Input() id;

  ngOnInit(): void {
    // Se subscribe al cambio de idioma
    this.lenguajeService.idiomaSubject.subscribe(data => {
      this.idioma = data;
      // Se solicitan los textos en el idioma seleccionado
      this.lenguajeService.getTranslationTexts(this.idioma).subscribe(texts => {
          this.textos = texts;
        },
        () => {
          this.toastrService.error(this.textos?.mensajes ? this.textos?.mensajes.MENSAJE_ERROR : Constants.MENSAJE_ERROR);
        });
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    this.consultarLugar('street', this.direccion);
  }

  addMap(lon: any, lat: any): any {
    this.map = new ol.Map({
      target: 'map' + this.id,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: 8
      })
    });
  }

  consultarLugar(tipo: string, lugar: string): void {
    this.mapaService.consultarLugar(tipo, lugar).subscribe(res => {
      const dir = {
        lat: parseFloat(res[0].lat),
        lon: parseFloat(res[0].lon)
      };
      this.addMap(dir.lon, dir.lat);
      this.add_map_point(dir.lon, dir.lat);
    });
  }

  add_map_point(lng, lat): void {
    const vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
        })]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: 'assets/img/pin (5).png',
        })
      })
    });

    this.map.addLayer(vectorLayer);
  }

}
