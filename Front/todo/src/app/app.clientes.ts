import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/model/cliente.model';
import { Resposta } from 'src/model/resposta.model';
import { clienteService } from './service/cliente.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './app.clientes.html',
  styleUrls: ['./app.clientes.css']
})
export class AppClientes {
  public form: FormGroup;
  public formPesquisar: FormGroup;
  public mode = 'inicial';
  public titulo = 'Clientes';
  public mascara = '';
  public clientes: Cliente[] = [];
  public enviouFormulario: Boolean = false;
  private clienteEdicao: Cliente;

  constructor(
    private cliService: clienteService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  )
  {
    this.form = this.fb.group(
      {
        nome: [
          '', 
          Validators.compose([
            Validators.minLength(3),
            Validators.maxLength(60),
            Validators.required
          ])
        ],
        telefone: [
          '', 
          Validators.compose([
            Validators.minLength(1),
            Validators.maxLength(20),
            Validators.required
          ])
        ],
        cpf: [
          '', 
          Validators.compose([
            Validators.minLength(1),
            Validators.maxLength(14),
            Validators.required
          ])
        ],
        sexo: [
          '', 
          Validators.compose([
            Validators.minLength(1),
            Validators.maxLength(1),
            Validators.required
          ])
        ]
      }
    );

    this.formPesquisar = this.fb.group(
      {
        buscarPor: ['NOME'],
        chavePesquisa: [''],
      }
    );

    this.pesquisar();
  }

  salvar(){
    if (this.form.invalid){
      this.enviouFormulario = true;
      return;
    }

    this.clienteEdicao = new Cliente(
      this.clienteEdicao ? this.clienteEdicao.clienteId : null,
      this.form.controls['nome'].value, 
      this.form.controls['sexo'].value,
      this.form.controls['cpf'].value,
      this.form.controls['telefone'].value,
    );

    this.cliService.atualizar(this.clienteEdicao).subscribe(
      (data: Resposta) => this.respostaSalvar(data), 
      error => console.log('Não foi possível salvar o cliente. motivo: ' + error.message)
    );
  }

  respostaSalvar(resposta: Resposta){
    if (resposta.houveErro){
      this.toastr.error(resposta.mensagem, 'Ocorreu um problema');
    } else {
      this.toastr.info('Salvo com sucesso!');
      this.limpar();
    }    
  }

  excluir(cliente: Cliente){
    Swal.fire({
      title: 'Confirmar exclusão?',
      text: cliente.nome,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
        if (result.value){
          this.cliService.excluir(cliente.clienteId).subscribe(
            (data: Resposta) => this.respostaExcluir(data, cliente.nome), 
            error => console.log('Não foi possível excluir o cliente. motivo: ' + error.message)
          );
        }
      }
    );
  }

  respostaExcluir(resposta: Resposta, nomeCliente: String){
    if (resposta.houveErro){
      this.toastr.error(resposta.mensagem, 'Ocorreu um problema');
    } else {
      this.toastr.info(nomeCliente + ' excluído com sucesso!');
      this.pesquisar();
    }    
  }

  pesquisar(){
    let querySQL: string = '';
    let buscarPor: string = this.formPesquisar.controls['buscarPor'].value;
    let chavePesquisa: string = this.formPesquisar.controls['chavePesquisa'].value;
  
    if (chavePesquisa) {
      chavePesquisa = chavePesquisa.toUpperCase();
      if (buscarPor == 'NOME')
        querySQL = 'where ' + buscarPor + ' like \'%' + chavePesquisa + '%\'';
      else if (buscarPor == 'CPF' || buscarPor == 'TELEFONE')
        querySQL = 'where NUMEROS(' + buscarPor + ') = \'' + chavePesquisa + '\'';
    }
  
    this.cliService.pesquisar(querySQL).subscribe(
      (data: Cliente[]) => {this.setClientes(data)}, 
      error => console.log('Não foi possível pesquisar os clientes. motivo: ' + error.message)
    );
  }

  setClientes(data: Cliente[]){
    this.clientes = data;
  }

  limpar(){
    this.form.reset();
    this.mode = 'inicial';
    this.form.controls['sexo'].setValue('');
    this.clienteEdicao = null;
  }

  alterar(cliente: Cliente){
    this.form.controls['nome'].setValue(cliente.nome);
    this.form.controls['sexo'].setValue(cliente.sexo);
    this.form.controls['cpf'].setValue(cliente.cpf);
    this.form.controls['telefone'].setValue(cliente.telefone);
    this.mode = 'cadastrar';
    this.clienteEdicao = cliente;
  }

  onChangeBuscarPor($event){
    let buscarPor: string = this.formPesquisar.controls['buscarPor'].value;
    this.formPesquisar.controls['chavePesquisa'].reset();
    this.mascara = '';

    if (buscarPor == 'CPF')
      this.mascara = '000.000.000-00';
    else if (buscarPor == 'TELEFONE')
      this.mascara = '(00) 00000-0000';
  }

  changeMode(mode: string){
    if (mode == 'inicial') {
      this.titulo = "Clientes";
      this.limpar();
    }
    else if (mode == 'cadastrar')
      this.titulo = "Cadastro de Clientes";  
    else if (mode == 'pesquisar')
      this.titulo = "Pesquisa de Clientes";  

    this.mode = mode;
  }

  mascaraCPF(cpf: string): string {
    if (!cpf)
      return '';

    return cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6, 9) + '-' + cpf.substring(9, 11);
  }

  mascaraTelefone(telefone: string): string {
    if (!telefone)
      return '';

    return '(' + telefone.substring(0, 2) + ') ' + telefone.substring(2, 7) + "-" + telefone.substring(7, 11);
  }
}

