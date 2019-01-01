
function addNewRow( className ){
var tbl=document.getElementsByClassName(className);
var newIn="";
}

//convert text lines to obj
function txtArToObj(str){
var lines=str.split("\n");
var rtrn={};
  for(let item of lines){
    console.log(item);
    if(item !== "\n"){
    var objs=item.split('|');
      if(objs[1] === undefined){
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
        chrome.storage.local.set({custList: custListObj},saveNotify(notif, 'Ignore List saved.', false ));

        //setting custom domain patter list
        chrome.storage.local.set({custDmnPatList: custDmnPatObj}, saveNotify(notif, 'Custom domains and patterns saved.', true ));

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
chrome.storage.local.get(null,(item) => {

    //set default
    if(!item.hasOwnProperty('mnl')){
    console.log('butWhyMod: manual setting doesn\'t exist. Setting default value.');
    item={mnl: true};
    chrome.storage.local.set({mnl: true});
    }


    //gets ignorelist and custom domain modal removal class
    //also sets defaults if the variables doesn't exist.
  var custList={};
    if(item.hasOwnProperty('custList') === false){
      chrome.storage.local.set({custList: {'mail.google.com': null, 'twitter.com': null }});
    custList={'mail.google.com': null, 'twitter.com': null };
    }
    else{
    custList=item.custList;
    }

  var custDmnPatList={};
    if(!item.hasOwnProperty('custDmnPatList')){
    chrome.storage.local.set({custDmnPatList: {'www.facebook.com':'_5hn6'}});
    custDmnPatList={'www.facebook.com':'_5hn6'};
    }
    else{
    custDmnPatList=item.custDmnPatList;
    }


 document.getElementsByClassName('custListTxt')[0].value=objToTxtAr(custList);
 document.getElementsByClassName('custDmnPatTxt')[0].value=objToTxtAr(custDmnPatList);
});

//running main function
startListen();
