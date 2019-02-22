import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UiCookie, UiToolbarService, UiColor} from 'ng-smn-ui';
import {UserService} from '../../core/user/user.service';
import {Router} from '@angular/router';
import {AuthApiService} from 'smn-auth';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  title: String;
  menuOpen: boolean;
  menuConfig: any;
  menu: any[];
  user: any;
  searchText: string;
  readyToGo: boolean;

  constructor(private titleService: Title,
              private toolbarService: UiToolbarService,
              private router: Router,
              private authApi: AuthApiService) {
    toolbarService.change.subscribe(title => {
      this.title = title;
    });

    this.menuConfig = {
      id: 'id',
      parentId: 'idMae',
      url: 'url',
      name: 'nome'
    };
    this.menu = UserService.getMenu();
    this.user = UserService.getUser();
  }

  ngOnInit() {
    this.titleService.setTitle('Mercúrio');
    this.toolbarService.set('');
    this.menuOpen = false;

    switch (this.user.idEmpresa) {
      case '1':
        document.body.classList.add('theme-acif');
        break;
      case '2':
        document.body.classList.add('theme-acimg');
        break;
    }

    /**
     * Descomentar o código para deixar o menu persistente
     * const isNavDrawerPersistent = UiCookie.get('NavDrawerPersistent') === 'true';
     * if (isNavDrawerPersistent) {
     *      this.menuOpen = true;
     * }
     * */
  }

  ngAfterViewInit() {
    this.toolbarService.registerMainToolbar(document.getElementById('app-header'));
    this.authApi.init({
      SMNAuthApiRoutes: environment.SMNAuthApiRoutes,
      headers: {
        'Authentication': UserService.getToken()
      }
    }).then(() => this.readyToGo = true);
  }

  isBright(color) {
    return UiColor.isBright(color);
  }

  logoff() {
    UserService.remove();
    this.router.navigate(['/login']);
  }

  searchMenu(text) {
    this.menu = UserService.getMenu();
    const regex = new RegExp(text.trim().toUpperCase(), 'i');
    if (text) {
      this.menu = this.lastChilds(this.menu);
      this.menu = this.menu.filter(itemMenu => regex.test(itemMenu.name.toUpperCase()))
        .map(item => {
          return {...item, path: this.findPath(item)};
        });
    } else {
      this.menu = [];
      this.menu = UserService.getMenu();
    }
  }

  lastChilds(item) {
    const arrayIteration = [];
    for (let index = 0; index < item.length; index++) {
      const el = item[index];
      el.childs ? this.lastChilds(el.childs) : arrayIteration.push(el);
    }
    return arrayIteration;
  }

  findPath(item, path?) {
    path = path || [];
    const menu = UserService.getMenu();
    if (item.parentId) {
      const pai = <any>menu.filter(opcaoMenu => opcaoMenu.id === item.parentId)[0];
      return this.findPath(pai, [...path, pai.name]);
    } else {
      return path;
    }
  }

  toPath(array) {
    return array.join(' > ');
  }

  closeSearch() {
    this.searchText = '';
    this.menu = UserService.getMenu();
  }

  goToPage(url) {
    this.menuOpen = false;
    this.searchText = '';
    this.searchMenu(this.searchText);
    this.router.navigate([url]);
  }
}


