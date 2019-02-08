import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';

interface Filter {
    filtro: String;
    pagina: number;
}

interface List {
    id: String;
    nome: String;
}

interface Params {
    api: String;
    funcionalidade: String;
    metodo: String;
}

interface ParamsRequest {
    _join: boolean;
}

export class SmnClassAutocomplete {

    private _api;
    private _params: Params;
    public loading: boolean;
    public searchTerms = new Subject<string>();
    public filter: Filter;
    public records: List[];
    public totalRecords: number;


    constructor(_api, params) {
        this._api = _api;
        this._params = params;

        this.filter = {
            filtro: '',
            pagina: 1
        };

        this.records = [];

        this.searchTerms
            .pipe(debounceTime(300))
            .subscribe((value: string) => {
                this.loading = true;
                this.get(value ? JSON.parse(value) : null);
            });
    }

    search(value?: ParamsRequest) {
        this.searchTerms.next(JSON.stringify(value));
    }

    get(value?: ParamsRequest) {
        this.loading = true;
        this.filter.pagina = 1;
        this._api.prep(this._params.api, this._params.funcionalidade, this._params.metodo)
            .call(this._join(value))
            .subscribe(res => {
                this.records = res.content.registros || [];
                this.totalRecords = res.content.totalRegistros;
            }, null, () => {
                this.loading = false;
            });
    }

    loadMore(value?: ParamsRequest) {
        if (this.totalRecords > this.filter.pagina * 10 && !this.loading) {
            this.filter.pagina = this.filter.pagina ? this.filter.pagina + 1 : 1;
            this.loading = true;

            this._api.prep(this._params.api, this._params.funcionalidade, this._params.metodo)
                .call(this._join(value))
                .subscribe(res => {
                    this.records = [...this.records, ...res.content.registros];
                }, null, () => {
                    this.loading = false;
                });
        }
    }

    _join(value: ParamsRequest) {
        if (value && value._join) {
            const newFilter = JSON.parse(JSON.stringify(value));
            delete newFilter._join;
            return {...this.filter, ...newFilter};
        } else if (value && !value._join) {
            return value;
        } else {
            this.filter.filtro = this.filter.filtro || '';
            return this.filter;
        }
    }

}
