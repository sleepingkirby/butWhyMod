
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
      if(objs[1]===undefined){
        objs[1]=null;
      }  
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
    if(key){
      if(obj[key] === undefined || obj[key] === null){
      rtrn+=nl+key;
      }
      else{
      rtrn+=nl+key+"|"+obj[key];
      }
    nl="\n";
    }
  }
return rtrn;
}


function saveNotify( obj, str, appnd=false){
console.log('butWhyMod: ' + str);
    if(appnd){
      obj.appendChild(document.createElement("br")); 
      obj.appendChild(document.createTextNode(str)); 
    }
    else{
      //clear all children
      while(obj.firstChild){
        obj.firstChild.remove();
      }
      obj.appendChild(document.createTextNode(str)); 
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
      var custDmnSty=document.getElementsByClassName('custDmnStyTxt')[0].value;
      var custDmnStyObj=txtArToObj(custDmnSty);

      var notif=document.getElementsByClassName('notify')[0];
      notif.id='';
      notif.innerHTML='';

        //setting custom list
        browser.storage.local.set({custList: custListObj}).then(saveNotify(notif, 'Ignore List saved.', false ), 
        (err) => {
        console.log('butWhyMod: Error: '+err);
        });

        //setting custom domain modal pattern list
        browser.storage.local.set({custDmnPatList: custDmnPatObj}).then(saveNotify(notif, 'Custom domains and modal patterns saved.', true ), 
        (err) => {
        console.log('butWhyMod: Error: '+err);
        } );

        //setting custom domain style patterns list
        browser.storage.local.set({custDmnStyList: custDmnStyObj}).then(saveNotify(notif, 'Custom domains and styled patterns saved.', true ), 
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
browser.storage.local.get().then((item) => {
 document.getElementsByClassName('custListTxt')[0].value=objToTxtAr(item.custList);
 document.getElementsByClassName('custDmnPatTxt')[0].value=objToTxtAr(item.custDmnPatList);
 document.getElementsByClassName('custDmnStyTxt')[0].value=objToTxtAr(item.custDmnStyList);
})
//running main function
startListen();
