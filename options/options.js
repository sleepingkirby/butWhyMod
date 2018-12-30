
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


function saveNotify( obj, str, appnd=false){
console.log('butWhyMod: ' + str);
    if(appnd){
    obj.innerHTML= obj.innerHTML + '<br>' + str;
    }
    else{
    obj.innerHTML=str;
    }
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
      var notif=document.getElementsByClassName('notify')[0];
      notif.id='';
      notif.innerHTML='';

        //setting custom list
        chrome.storage.local.set({custList: custListObj}).then(saveNotify(notif, 'Ignore List saved.', false ), 
        (err) => {
        console.log('butWhyMod: Error: '+err);
        });

        //setting custom domain patter list
        chrome.storage.local.set({custDmnPatList: custDmnPatObj}).then(saveNotify(notif, 'Custom domains and patterns saved.', true ), 
        (err) => {
        console.log('butWhyMod: Error: '+err);
        } );

      notif.id='fadeOut';
        notif.addEventListener("animationend", ()=>{
        notif.id='';
        });

      break;
      default:
      break;
    }
  });

}


//getting saved settings
chrome.storage.local.get().then((item) => {
 document.getElementsByClassName('custListTxt')[0].value=objToTxtAr(item.custList);
 document.getElementsByClassName('custDmnPatTxt')[0].value=objToTxtAr(item.custDmnPatList);
})
//running main function
startListen();
