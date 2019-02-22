interface List {
    id: String;
    nome: String;
}

interface Params {
    api: String;
    funcionalidade: String;
    metodo: String;
    param?: any;
}

interface ParamsRequest {
    _join: boolean;
}

export class Select {

    private _api;
    private _params: Params;
    public loading: boolean;
    public records: List[];


    constructor(_api, params: Params) {
        this._api = _api;
        this._params = params;
        this.records = [];
        if (params) {
            this.get(params.param);
        }
    }

    static isEmpty(value, property, callback) {
        if (!value) {
            callback();
            return null;
        }
        return property;
    }

    get(value?: ParamsRequest) {
        this.loading = true;
        this._api.prep(this._params.api, this._params.funcionalidade, this._params.metodo)
            .call(this._join(value))
            .subscribe(res => {
                this.records = res.content || [];
            }, null, () => {
                this.loading = false;
            });
    }

    _join(value: ParamsRequest) {
        if (value && value._join) {
            const newFilter = JSON.parse(JSON.stringify(value));
            delete newFilter._join;
            return newFilter;
        } else if (value && !value._join) {
            return value;
        }
    }

}
