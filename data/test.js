date = '02/31/2021';
date = new Date(date);

let dd = String(date.getDate()).padStart(2,'0');
let mm = String(date.getMonth() + 1).padStart(2,'0');
let yyyy = date.getFullYear();

console.log(typeof dd)
console.log(date.getTime())
if(isValidDate(date)){
    throw "Error in date11"
    
}
if(isNaN(date.getTime())){
    console.log('.............................................');
}

let current = new Date();
let dd1 = String(current.getDate()).padStart(2,'0');
let mm1 = String(current.getMonth() + 1).padStart(2,'0');
let yyyy1 = current.getFullYear();

current = mm1 + '/' + dd1 + '/' + yyyy1;

if(Number(yyyy) < 1900 || Number(yyyy) > (Number(yyyy1) + 1) ){

    throw "Error in date"
}

function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime());
}