# Cache Service

Serviço destinado a armazenar dados para que possam ser consultados a qualquer momento sem a necessidade de novas requisições. Feito para [Angular](http://angular.io) (TypeScript), com dependência do API Service.

**O que é?**
O objetivo do Cache Service é guardar dados "estáticos", ou melhor dizendo, dados que não irão se alterar com frequência, como por exemplo dropdowns de tabelas de domínio, visando economizar requisições assim também não consumindo banda do cliente.

**Como funciona?**
Seu funcionamento é bem simples, você deve injeta-lo em um componente, e onde iria fazer a requisição normal chamar o cache service passando alguns simples parâmetros como um nome para propriedade onde ficará/está guardado os dados que deseja, e caminho do API Service para fazer a requisição caso necessário. 
O que o service vai fazer é verificar se já possui os dados guardados em cache de acordo com o nome da propriedade passada, e caso não os tenha ele realiza uma requisição para obtê-los e depois retorna estes dados.

**Como utilizar?**

**Obs:** Para que o Cache Service funcione ele depende do nosso querido API Service, então você deve tê-lo em seu projeto.

- Primeiramente, pegue aqui no repositório o Cache Service, escolhendo com base na arquitetura do API Service utilizado em seu sistema: **Angular 6** ou **Angular 4**.

- Coloque o arquivo em seu projeto no lugar que mais for conveniente (recomendo guardar em uma paste de utils/helpers no core da sua estrutura).

- Abra o arquivo e verifique se os imports estão apontando para o lugar certo.

- Coloque o serviço como provider em um de seus Modules principais (recomendo colocar no **SharedModule**, dependendo da estrutura:

```js
@NgModule({  
   declarations: [],  
   exports: [],  
   providers: [ApiService, CacheService]
});
```
- Importe e injete o service como dependência no componente onde você deseja utilizar:
```js
// Imports necessários
import { ApiService } from '../../../../core/api/api.service';
import { CacheService } from '../../../../core/cache.service';

export class TesteCacheComponent {
	// Injetando o service como dependência
	constructor(
		private cacheService: CacheService
	) {}
}
```
- Feito isso, você já poderá utilizar o cache service.

**Métodos**
Para obter dados através do Cache Service é simples, basta utilizar das funções disponibilizadas por ele:

***getCache()***
Esta função permite você obter os dados através do caminho de um endpoint no API Service, aceitando os seguintes parâmetros: 

-**property**: Nome da propriedade onde irá buscar ou armazenar os dados.
-**api, funcionalidade e metodo**: para realizar a requisição para obter os dados, caso necessário.
-**options**: aceita headers, params, entre outras coisas que algumas requisições podem necessitar, este deve ser um objeto. (OPCIONAL)
-**filter**: permite passar um filtro para a requisição, este deve ser um objeto. (OPCIONAL)
-**forceRequest**: Boolean que permite que você force o service a realizar uma requisição, mesmo que já tenha dados na propriedade. (OPCIONAL)

Ex:
```js
getUnidades() {
	this.cacheService
		.getCache('unidades', 'administracao', 'uniadade', 'selecionarSimples')
		.then(data => {
			console.log(data);
		});
}
```
No exemplo acima, estamos buscando pela propriedade **"unidades"**, caso essa propriedade exista em cache o service irá retornar os dados, caso não exista ele irá fazer uma requisição através do caminho passado **"administracao", "unidade", "selecionarSimples"**, (api, funcionalidade, metodo), e ao obter os dados ele nos retorna.
***
***getCacheByHttp()***

**Obs:** Este método dependerá da estrutura do API Service presente no sistema, favor verificar (Somente Angular 6).

Esta função permite você obter os dados através do método da requisição e do um endpoint , aceitando os seguintes parâmetros: 

-**property**: Nome da propriedade onde irá buscar ou armazenar os dados.
-**method**: Tipo da requisição (GET, POST...).
-**url**: Endpoint para obter os dados.
-**options**: aceita headers, params, entre outras coisas que algumas requisições podem necessitar, este deve ser um objeto. (OPCIONAL)
-**filter**: permite passar um filtro para a requisição, este deve ser um objeto. (OPCIONAL)
-**forceRequest**: Boolean que permite que você force o service a realizar uma requisição, mesmo que já tenha dados na propriedade. (OPCIONAL)

Ex:
```js
getUnidades() {
	this.cacheService
		.getCacheByHttp('unidades', 'GET', 'http://meudominio.com.br/api/unidades')
		.then(data => {
			console.log(data);
		});
}
```
No exemplo acima, estamos buscando pela propriedade **“unidades”**, caso essa propriedade exista em cache o service irá retornar os dados, caso não exista ele irá fazer uma requisição através do endpoint passado junto ao método, e ao obter os dados ele nos retorna.
***
***setCache()***
Permite inserir manualmente dados no cache, para que possa ser utilizado posteriormente, aceita os seguintes parâmetros:

-**property**: Nome da propriedade onde os dados ficaram armazenados.
-**data**: Dados a serem salvos,

Ex:
```js
setUnidades() {
	this.cacheService
		.setCache('unidades', [{id: 1, nome: 'unidade1'}]);
}
``` 
No exemplo acima, estamos inserindo dados na propriedade **"unidades"** que vai poder ser acessada em outro momento. 
***
***verifyCache()***
Permite obter todos os dados salvos no Cache Service.

Ex:
```js
getDataCache() {
	// Retorna um objeto com todas as propriedades com os dados salvos=
	console.log(this.cacheService.verifyCache());
}
```
***
**Feito com ❤️ pelos Devs da [SMN](http://smn.com.br/)**