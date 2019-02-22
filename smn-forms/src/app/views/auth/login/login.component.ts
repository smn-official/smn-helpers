import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UiColor, UiSnackbar} from 'ng-smn-ui';
import {ApiService} from '../../../core/api/api.service';
import {environment} from '../../../../environments/environment';
import {UserService} from '../../../core/user/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  headers: any;
  preLogin: any;
  info: any;
  typeText: boolean;
  loading: boolean;
  authByEmail: boolean;
  senhaExpirada: any;

  @ViewChild('tabsPages') tabsPages;
  @ViewChild('loginForm') loginForm;


  constructor(private titleService: Title,
              private router: Router,
              private element: ElementRef,
              private api: ApiService) {
    this.preLogin = {};
    this.info = {
      matenhaConectado: true
    };
    this.senhaExpirada = {};
    this.authByEmail = environment.AUTH_BY_EMAIL;
  }

  ngOnInit() {
    this.headers = {'Content-Type': 'application/json', 'System': environment.SMN_AUTH_ID};
    document.body.removeAttribute('class');
  }

  ngAfterViewInit() {
    this.titleService.setTitle('Mercúrio');
  }

  isBright(color: string) {
    return UiColor.isBright(color);
  }

  getInfo(form, info) {
    if (form.invalid || this.loading) {
      form.controls.usuario.markAsTouched();
      form.controls.usuario.markAsDirty();
      this.focusElement('#pre-login-usuario');
      return;
    }

    this.loading = true;

    this.api
      .http('POST', `${environment.SMN_AUTH_API}/login/dados`, {headers: this.headers})
      .call({login: info.usuario})
      .subscribe(res => {
        res.content.user = Object.assign(res.content.user, {
          usuario: info.usuario,
          matenhaConectado: true
        });

        this.info = res.content.user;
        this.tabsPages.pagesGoToPage(2);
        this.focusElement('#login-senha', true);
        this.loginForm.reset();
      }, (err) => {
        switch (err.status) {
          case 404:
            form.controls.usuario.setErrors({notFound: true});
            break;
        }
      }, () => {
        this.loading = false;
      });

  }

  login(form, info) {
    const elementPassword = this.element.nativeElement.querySelector('#login-senha');

    if (form.invalid || this.loading) {
      form.controls.senha.markAsTouched();
      form.controls.senha.markAsDirty();
      elementPassword.focus();
      return;
    }

    this.loading = true;

    this.api
      .http('POST', `${environment.SMN_AUTH_API}/login`, {headers: this.headers})
      .call({login: info.usuario, senha: info.senha})
      .subscribe(res => {
        const content = res.content;
        this.api.set(content.api, content.opcoes);
        UserService.setToken(content.token, info.matenhaConectado);
        UserService.setMenu(content.opcoes);
        UserService.setUser(content.user);
        this.router.navigate(['/']);
      }, (res) => {
        switch (res.status) {
          case 401:
            switch (res.error.executionCode) {
              case 2:
                form.controls.senha.setErrors({wrongPassword: true});
                elementPassword.focus();
                break;
              case 3:
                this.tabsPages.pagesGoToPage(3);
                form.reset();
                break;
              case 4:
                this.senhaExpirada = Object.assign({}, info);
                delete this.senhaExpirada.senha;
                this.focusElement('#senha-antiga', true);
                this.tabsPages.pagesGoToPage(5);
                form.reset();
                break;
              case 5:
                this.tabsPages.pagesGoToPage(4);
                form.reset();
                break;
            }
            break;
        }
      }, () => {
        this.loading = false;
      });
  }

  redefinirSenha(form, info) {
    if (form.invalid || this.loading) {
      ['senhaAntiga', 'novaSenha', 'confirmacaoSenha'].forEach(field => {
        form.controls[field].markAsTouched();
        form.controls[field].markAsDirty();
      });
      this.element.nativeElement.querySelector('.senha-expirada input.ng-invalid').focus();
      return;
    }

    this.loading = true;

    this.api
      .http('POST', `${environment.SMN_AUTH_API}/login/alterar-senha`, {headers: this.headers})
      .call({
        login: info.usuario,
        senha: info.senha,
        novaSenha: info.novaSenha,
        confirmacaoNovaSenha: info.confirmacaoNovaSenha,
      })
      .subscribe(res => {
        this.tabsPages.pagesGoToPage(2);
        setTimeout(() => {
          this.senhaExpirada = {};
          form.reset();
        }, 280);
      }, (res) => {
        switch (res._status) {
          case 400:
            this.validarSenhasDivergentes(form);
            break;
          case 401:
            form.controls.senhaAntiga.setErrors({wrongPassword: true});
            this.focusElement('#senha-antiga');
            break;
          case 404:
            UiSnackbar.show({
              text: 'Não conseguimos encontrar seu usuário',
              actionText: 'Refazer login',
              action: close => {
                this.tabsPages.pagesGoToPage(1);
                form.reset();
                close();
              }
            });
            break;
        }
      }, () => {
        this.loading = false;
      });
  }

  validarSenhasDivergentes(form) {
    if (this.senhaExpirada.novaSenha !== this.senhaExpirada.confirmacaoNovaSenha) {
      setTimeout(() => form.controls.confirmacaoSenha.setErrors({notEqual: true}));
    }
  }

  focusElement(selector, withDelay?) {
    setTimeout(() => {
      this.element.nativeElement.querySelector(selector).focus();
    }, withDelay ? 280 : 0);
  }

  backToLogin() {
    this.tabsPages.pagesGoToPage(1);
    this.focusElement('#pre-login-usuario');
  }


}
