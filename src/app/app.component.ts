import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sic-web-siar';

  constructor(
    /*private lenguajeServiceService: LenguajeService,
    private translate: TranslateService*/
  ) {
    /*this.translate.setDefaultLang('en');
    this.lenguajeServiceService.idiomaSubject.subscribe(data => {
      this.translate.use(data);
    });*/
  }

  setPaisId($event): void {
    console.log($event);
  }
}
