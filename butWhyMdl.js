//body should never have overflow: hidden
document.body.style.overflow = "scroll";
//var x = document.getElementsByClassName("");
var objArr = document.body.querySelectorAll(".some-modal-class");

objArr.forEach( function(obj){
obj.style.display = "none";
});
