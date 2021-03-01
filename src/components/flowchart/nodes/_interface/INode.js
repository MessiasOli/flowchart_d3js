export class INode {
    constructor(nameClass) {
        this.decorate = () => { throw errorMsg( nameClass, 'renderMe()') }
        this.remover = () => { throw errorMsg( nameClass, 'remover()') }
    }
}

function errorMsg(nameClass, nameMethod){
    return `ATENÇÃO! - Implementar método ${nameMethod} na classe ' + ${nameClass}`
}