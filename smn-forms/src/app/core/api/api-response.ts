import {HttpEventType} from '@angular/common/http';
import {throwError} from 'rxjs';
import {UiSnackbar} from 'ng-smn-ui';

export class ApiReponse {

    static extractData(res, callback, cleanResult) {
        if (!callback) {
            return;
        }

        if (cleanResult) {
            callback(res);
        }

        if (res.type === HttpEventType.Response && !cleanResult) {
            callback(res.body);
        }
    }

    static handleError(res, callback, cleanError) {
        if (callback) {
            callback(res);
        }

        if (cleanError) {
            return throwError(res);
        }

        switch (res.status) {
            case 0:
                UiSnackbar.show({
                    text: `Um de nossos serviços está fora do ar e não foi possível processar sua requisição. Tente novamente mais tarde.`,
                    actionText: 'OK',
                    center: true,
                    action: close => close(),
                    duration: 1000
                });
                break;
            case 400:
                UiSnackbar.show({
                    text: `Requisição inválida. Verifique as informações fornecidas.`,
                    actionText: 'OK',
                    center: true,
                    action: close => close()
                });
                break;
            case 409:
                UiSnackbar.show({
                    text: res.error.content.message,
                    actionText: 'OK',
                    center: true,
                    action: close => close()
                });
                break;
            case 500:
                UiSnackbar.show({
                    text: `Ocorreu um erro interno. Já fomos informados do erro. Tente novamente mais tarde.`,
                    actionText: 'OK',
                    center: true,
                    action: close => close(),
                    duration: 1000
                });
        }

        return throwError(res);
    }

}
