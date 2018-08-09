import {Injectable} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {ApiServiceRequest, ApiServiceRequestOptions} from '../../api/api-request';

const cacheData: any = [];

@Injectable()
export class CacheService {

    // Substitua "FinanceApiService" pela api do seu sistema
    constructor(private _api: ApiService) {
    }

    /**
     * Verifica se a propriedade já existem em cache, caso não exista realiza a requisição via APIService para obter
     * @param {string} property Nome da propriedade requisitada
     * @param {string} api API onde será feita a requisição
     * @param {string} funcionalidade funcionalidade para realizar a requisição
     * @param {string} metodo método para realizar a requisição
     * @param {Object} options [OPCIONAL] Options para realizar da requisição
     * @param {Object} filter [OPCIONAL] Filtro para requisição
     * @param {boolean} forceRequest [OPCIONAL] Forca a requisição
     * @returns {Promise<any>} Retorna os dados do dropdown requisitado
     */
    public getCache(property: string, api: string, funcionalidade: string, metodo: string, options?: ApiServiceRequestOptions, filter?: {}, forceRequest?: boolean) {
        return new Promise(resolve => {
            if (forceRequest || !cacheData[property] || (typeof cacheData[property] === 'object' && !Object.keys(cacheData[property]).length)) {
                this.get(api, funcionalidade, metodo, filter).then(res => {
                    cacheData[property] = res;
                    resolve(cacheData[property]);
                }).catch(e => {
                    console.error(e);
                });
            } else {
                resolve(cacheData[property]);
            }
        });
    }

    /**
     * Requisição via APIService, para obter os dados da propriedade
     * @param {string} api API onde será feita a requisição
     * @param {string} funcionalidade Funcionalidade para realizar a requisição
     * @param {string} metodo Método para realizar a requisição
     * @param {Object} options [OPCIONAL] Options para realizar da requisição
     * @param {any} filter [OPCIONAL] Filtro para a requisicao - Deve ser passado um objeto com os filtros necessários
     */
    private get(api, funcionalidade: string, metodo: string, options?: {}, filter?: {}) {
        return new Promise((resolve, reject) => {
            this._api
                .prep(api, funcionalidade, metodo, options)
                .call(filter)
                .subscribe(res => {
                    resolve(res.content);
                }, (e) => {
                    reject(e);
                });
        });
    }

    /**
     * Verifica se a propriedade já existem em cache, caso não exista realiza a requisição HTTP para obter
     * @param {string} property Nome da propriedade requisitada
     * @param {ApiServiceRequest} method Tipo da requisição (GET, POST...)
     * @param {ApiServiceRequest} url Endpoint da requisição
     * @param {ApiServiceRequestOptions} options [OPCIONAL] Options para realizar da requisição
     * @param {Object} filter [OPCIONAL] Filtro para a requisicao - Deve ser passado um objeto com os filtros necessários
     * @param {boolean} forceRequest [OPCIONAL] Forca a requisição
     * @returns {Promise<any>} Retorna os dados da propriedade requisitada
     */
    public getCacheByHttp(property: string, method: ApiServiceRequest['method'], url: ApiServiceRequest['url'], options?: ApiServiceRequestOptions, filter?: {}, forceRequest?: boolean) {
        return new Promise(resolve => {
            if (forceRequest || !cacheData[property] || (typeof cacheData[property] === 'object' && !Object.keys(cacheData[property]).length)) {
                this.getWithHttp(method, url, options, filter).then(res => {
                    cacheData[property] = res;
                    resolve(cacheData[property]);
                }).catch(e => {
                    console.error(e);
                });
            } else {
                resolve(cacheData[property]);
            }
        });
    }

    /**
     * Requisição via HTTP Request, para obter os dados da propriedade
     * @param {ApiServiceRequest} method Tipo da requisição (GET, POST...)
     * @param {ApiServiceRequest} url Endpoint da requisição
     * @param {ApiServiceRequestOptions} options [OPCIONAL] Options para realizar da requisição
     * @param {Object} filter [OPCIONAL] Filtro para a requisicao - Deve ser passado um objeto com os filtros necessários
     * @returns {Promise<any>} Retorna os dados da propriedade requisitada
     */
    private getWithHttp(method: ApiServiceRequest['method'], url: ApiServiceRequest['url'], options?: ApiServiceRequestOptions, filter?: {}) {
        return new Promise((resolve, reject) => {
            this._api
                .http(method, url, options)
                .call(filter)
                .subscribe(res => {
                    resolve(res.content);
                }, (e) => {
                    reject(e);
                });
        });
    }

    /**
     * Retorna todos os itens que estão em cache
     * @returns {Object} Objeto com os dropdowns em cache
     */
    public verifyCache(): Object {
        return cacheData;
    }

    /**
     * Permite inserir manualmente dados no cache
     * @param {string} property Propriedade onnde os dados que serão inseridos
     * @param {any} data Dados a serem inseridos
     */
    public setCache(property: string, data: any): void {
        cacheData[property] = data;
    }
}
