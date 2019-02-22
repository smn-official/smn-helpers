import {Injectable} from '@angular/core';
import {UiCookie} from 'ng-smn-ui';
import { environment } from '../../../environments/environment';

let user: any = {};
let token: string;
let menu: any[];

const COOKIE_NAME: any = {
    authentication: `${environment.SYSTEM_PREFIX}Authentication`,
    keepConnect: `${environment.SYSTEM_PREFIX}KeepConnect`
};

@Injectable()
export class UserService {

    constructor() {
    }

    public static get() {
        return {
            user,
            token
        };
    }

    public static getUser() {
        return user;
    }

    public static setUser(newUser) {
        user = newUser;
    }

    public static setMenu(newMenu) {
        menu = newMenu;
    }

    public static getMenu() {
        return menu;
    }

    public static getToken() {
        return UiCookie.get(COOKIE_NAME.authentication);
    }

    public static setToken(newToken, keepConnect?: boolean) {
        token = newToken;
        this.setCookie(token, keepConnect);
    }

    public static getCookie() {
        return {
            authentication: UiCookie.get(COOKIE_NAME.authentication),
            keepConnect: UiCookie.get(COOKIE_NAME.keepConnect)
        };
    }

    public static setCookie(myToken, keepConnect?) {
        UiCookie.set(COOKIE_NAME.keepConnect, keepConnect, keepConnect ? 365 : null, '/');
        UiCookie.set(COOKIE_NAME.authentication, myToken, keepConnect ? 365 : null, '/');
    }

    public static remove() {
        user = null;
        token = null;
        UiCookie.delete(COOKIE_NAME.keepConnect);
        UiCookie.delete(COOKIE_NAME.authentication);
    }
}
