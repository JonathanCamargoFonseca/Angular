import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from 'src/model/cliente.model';
import { Resposta } from 'src/model/resposta.model';

@Injectable()
export class clienteService{
    readonly apiURL : String;

    constructor(private http: HttpClient){
        this.apiURL = 'http://localhost:8080/WS/clientes/';
    }

    atualizar(cliente: Cliente): Observable<Resposta>{
        let queryParams = this.apiURL + 'atualizar';
        return this.http.post<Resposta>(queryParams, 'cliente=' + JSON.stringify(cliente));
    }

    excluir(id: Number): Observable<Resposta>{
        let queryParams = this.apiURL + 'excluir?id=' + id;
        return this.http.delete<Resposta>(`${ queryParams }`);
    }

    pesquisar(parametros): Observable<Cliente[]>{
        let queryParams = this.apiURL + 'pesquisar' + (parametros == '' ? '' :  '?filtro=' + encodeURI(parametros));
        return this.http.get<Cliente[]>(`${ queryParams }`);
    }

}