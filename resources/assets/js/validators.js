
const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const phoneRegex = /^[0-9:]{10}/g;


export function validAddress(item, index){
    var valid = true;
    var errors = [];
    if(!item.name || item.name.length > 80){
        valid = false;
        errors.push("Nombre inválido. Máximo 80 caracteres");
    }
    if(!item.street || item.street.length > 35){
        valid = false;
        errors.push("Dirección inválida. Máximo 35 caracteres");
    }
    if(!item.street2 || item.street2.length > 35){
        valid = false;
        errors.push("Dirección 2 inválida. Máximo 35 caracteres");
    }
    if(!item.zipcode || item.zipcode.length > 5){
        valid = false;
        errors.push("Código postal inválido. Máximo 5 caracteres");
    }
    if(item.reference && item.reference.length > 255){
        valid = false;
        errors.push("Referencia inválida. Máximo 255 caracteres");
    }
    if(!item.email || item.email.length > 255 || !emailRegex.test(item.email)){
        valid = false;
        errors.push("Email inválido. Máximo 35 caracteres");
    }
    //console.log(phoneRegex.test(item.phone.toString()));
    if(!item.phone || item.phone.toString().length > 20){
        valid = false;
        errors.push("Teléfono inválido. Máximo 20 caracteres");  
    }
    return [valid, {row: index, errorMessage: errors}];
}

export function validShipment(item, index){
    var valid = true;
    var errors = [];
    if(typeof(item.weight) != "number"){
        valid = false;
        errors.push("El peso del paquete es inválido");
    }
    if(typeof(item.length) != "number"){
        valid = false;
        errors.push("El largo del paquete es inválido");
    }
    if(typeof(item.height) != "number"){
        valid = false;
        errors.push("El alto del paquete es inválido");
    }
    if(typeof(item.width) != "number"){ 
        valid = false;
        errors.push("El ancho del paquete es inválido");
    }
    return [valid, {row: index, errorMessage: errors}];
}
