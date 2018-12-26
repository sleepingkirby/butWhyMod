//body should never have overflow: hidden
document.body.style.overflow = "scroll";
//var x = document.getElementsByClassName("");
//var objArr = document.body.querySelectorAll("div");
var objArr = document.getElementsByTagName("div");

for(i=0; i<objArr.length; i++){
	if(objArr[i].className.match(/modal/ig)){
	objArr[i].style.display="none";
	}

}
