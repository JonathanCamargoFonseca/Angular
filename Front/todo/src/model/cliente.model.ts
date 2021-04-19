export class Cliente{
    constructor(
        public clienteId: Number, 
        public nome: string, 
        public sexo: string,
        public cpf: string,
        public telefone: string,
    ) {
        this.nome = nome.toUpperCase();
        this.sexo = sexo.toUpperCase();
    }
}