import {Injectable} from '@angular/core';
import {ApiService} from '../api/api.service';

const cacheData: any = [];

@Injectable()
export class CacheService {

    // Substitua "ApiService" pela api do seu sistema
    constructor(private _api: ApiService) {
    }

    /**
     * Requisição para obter os dados do dropdown
     * @param {string} funcionalidade funcionalidade para realizar a requisição
     * @param {string} metodo método para realizar a requisição
     * @param {Object} filtro [OPCIONAL] Filtro para a requisicao - Deve ser passado um objeto com os filtros necessários
     */
    public get(funcionalidade: string, metodo: string, filtro?: {}) {
        return new Promise((resolve, reject) => {
            this._api
                .prep(funcionalidade, metodo)
                .call(filtro)
                .subscribe(res => {
                    resolve(res.content);
                }, (e) => {
                    reject(e);
                });
        });
    }

    /**
     * Verifica se a propriedade já existem em cache, caso não exista realiza a requisição para obte-lô
     * @param {string} property Nome da propriedade requisitada
     * @param {string} funcionalidade funcionalidade para realizar a requisição
     * @param {string} metodo método para realizar a requisição
     * @param {Object} filtro [OPCIONAL] Filtro para requisição
     * @returns {any} Retorna os dados da propriedade requisitada
     */
    public getCache(property: string, funcionalidade: string, metodo: string, filtro?: {}) {
        return new Promise(resolve => {
            if (!cacheData[property] || (typeof cacheData[property] === 'object' && !cacheData[property].length)) {
                this.get(funcionalidade, metodo, filtro).then(res => {
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
