# smn-class-autocomplete

Classe utilizada para a implementação simplificação do UiAutocomplete em projetos com o SMNUI.


## Antes 

**HTML**

```html
<ui-input-container>
    <input type="text"
           name="persons"
           id="persons"
           autocomplete="off"
           uiInput
           uiAutocomplete
           #fieldPersons="ngModel"
           [(ngModel)]="info.namePersons"
           [(modelValue)]="info.idPersons"
           [model-property]="'id'"
           [primary]="'name'"
           (input)="getPersons()"
           (focus)="getPersons()"
           (loadMore)="loadMorePersons()"
           [list]="listPersons"
           [loading]="loadingPersons">
           
    <label for="persons">Person</label>
    
</ui-input-container>
```

**TS**

````typescript
// ...
    getPersons() {
        this.loadingPersons = true;
        this.info.pagePersons = 1;
        this._api.prep('administracao', 'pessoa', 'dropdown')
        .call({
                filtro: this.info.namePersons || '',
                pagina: this.info.pagePersons || 1
            })
            .subscribe(res => {
                this.listPersons = res.content.registros || [];
                this.info.totalPersons = res.content.totalPersons;
            }, null, () => {
                this.loadingPersons = false;
            });
    }
    
    loadMorePersons() {
        if (this.info.totalPersons > this.info.pagePersons * 10 && !this.loadingPersons) {
            this.info.pagePersons = this.info.pagePersons ? this.info.pagePersons + 1 : 1;
            this.loadingPersons = true;
    
            this._api.prep('administracao', 'pessoa', 'dropdown').call({
                    filtro: this.info.namePersons || '',
                    pagina: this.info.pagePersons || 1
                })
                .subscribe(res => {
                    this.listPersons = [...this.listPersons, ...res.content.registros];
                }, null, () => {
                        this.loadingPersons = false;
                });
        }
    }
// ...
````

## Depois

**HTML**

````html
<ui-input-container>

    <input type="text" 
       name="persons"
       id="persons"
       autocomplete="off"       
       uiInput
       uiAutocomplete
       #fieldPersons="ngModel"
       [(ngModel)]="persons.filter.filtro"
       [(modelValue)]="info.idPersons"
       [model-property]="'id'"
       [primary]="'name'"
       (input)="persons.search()"
       (focus)="persons.search()"
       (loadMore)="persons.loadMore()"
       [list]="persons.records"
       [loading]="persons.loading">

    <label for="persons">Person</label>
    
</ui-input-container>
````

````typescript
// ...
constructor(private _api: ApiService) {
    
    this.persons = new SmnClassAutocomplete(_api, {
        api: 'administracao',
        funcionalidade: 'pessoa',
        metodo: 'dropdown'
    });
    
}
// ...
````

## Métodos 

- **search(value?)**: Utilizado para fazer a busca de registros na primeira pagina.

    value: Recebe os parametros da requisição, por padrão ele envia um objeto com filtro e pagina, 
    caso deseje enviar mais propriedades ou propriedades diferentes basta colocar dentro do dentro do
    value.
    
        
    Em casos onde você desejo adicinar algum parametro na requisição sem perder os atuais 
    parametros (filtro, pagina), adicionar a propriedade _join com o valor de true.
         
     persons.search({_join: true, age: 18});
     
- **loadMore(value?)**: Utilizado para fazer a busca de registros realizando a paginação automaticamente.

    value: Recebe os parametros da requisição, por padrão ele envia um objeto com filtro e pagina, 
    caso deseje enviar mais propriedades ou propriedades diferentes basta colocar dentro do dentro do
    value.
    
        
    Em casos onde você desejo adicinar algum parametro na requisição sem perder os atuais 
    parametros (filtro, pagina), adicionar a propriedade _join com o valor de true.
         
     persons.loadMore({_join: true, age: 18});     

## Variaveis

- **loading**: Retorna um boolean como true se estiver carregando a listagem.

- **records**: Retorna um array de objetos com os resultados do autocomplete.

- **totalRecords**: Retorna um number com o total de registros.

- **filter**: Retorna os filtros que estão sendo utilizados.




