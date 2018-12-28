
function addNewRow( className ){
var tbl=document.getElementsByClassName(className);
var newIn="";
}

//convert text lines to obj
function txtArToObj(str){
var lines=str.split("\n");
var rtrn={};
  for(let item of lines){
    if(item !== "\n"){
    var objs=item.split('|');
    rtrn[objs[0]]=objs[1];
    }
  }
console.debug(rtrn);
return rtrn;
}

//convert object to text lines
function objToTxtAr(obj){
var rtrn="";
var nl="";
  for(var key in obj){
    if(obj[key] === undefined || obj[key] === null){
    rtrn+=nl+key;
    }
    else{
    rtrn+=nl+key+"|"+obj[key];
    }
  nl="\n";
  }
return rtrn;
}

//main function
function startListen(){
  document.addEventListener("click", (e) => {
    switch(e.target.name){
      case 'savePref':
      //grab settings, parse and enter into storage.local
      var custList=document.getElementsByClassName('custListTxt')[0].value;
      var custListObj=txtArToObj(custList);
      var custDmnPat=document.getElementsByClassName('custDmnPatTxt')[0].value;
      var custDmnPatObj=txtArToObj(custDmnPat);

      browser.storage.local.set({custList: custListObj}).then(()=>{console.log('butWhyMdl: set \'custList\' to storage')}, (err) => {console.log('butWhyMdl: Error: '+err);} );
      browser.storage.local.set({custDmnPatList: custDmnPatObj}).then(()=>{console.log('butWhyMdl: set \'custDmnPatList\' to storage')}, (err) => {console.log('butWhyMdl: Error: '+err);} );
      break;
      default:
      break;
    }
  });

}


//getting saved settings
browser.storage.local.get().then((item) => {
 document.getElementsByClassName('custListTxt')[0].value=objToTxtAr(item.custList);
 document.getElementsByClassName('custDmnPatTxt')[0].value=objToTxtAr(item.custDmnPatList);
})
//running main function
startListen();
