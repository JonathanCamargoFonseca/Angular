export class Resposta{
    constructor(
        public houveErro: Boolean, 
        public mensagem: string, 
        public retornoInt: Number,
    ) {}
}