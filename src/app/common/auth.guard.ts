import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Menu } from '../modelos/menu';
import { GenericoService } from '../servicios/generico.service';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  menuList: Array<Menu> = [];

  constructor(private router: Router, private genericoService: GenericoService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.getMenu()
      .then(() => {
        console.log(next.data);
        switch (state.url) {
          case '/login':
          case '/registro':
            return true;
          default:
            return this.authUrl(state.url) ? true : this.router.parseUrl('/');
        }
      })
      .catch(() => {
          return this.router.parseUrl('/');
      });
  }

  authUrl(uri: string): boolean {
    const found: Menu = this.menuList.find(element => element.urlMenu === uri);
    if (found) {
      return true;
    } else {
      return false;
    }
  }

  getMenu(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = Constants.PATH_MENU_TOKEN;
      this.genericoService.get(url).subscribe(res => {
        if (res.message === '200') {
          this.menuList = res.data.menu;
          resolve();
        }
      }, error => {
        console.error(error);
        reject();
      });
    });
  }
}
