const name = "Blessing"; //string
const age = 6; //number
const minAge = 18;
const isTheBarOwner = true;
if(age > minAge || isTheBarOwner){
    console.log(`Hi ${name} you are allowed to be at the bar`)
}else{
    console.log(`You are under age ${name}`)
}
