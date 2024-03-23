
function addNewRow( className ){
var tbl=document.getElementsByClassName(className);
var newIn="";
}

//convert text lines to obj
function txtArToObj(str){
var lines=str.split("\n");
var rtrn={};
  for(let item of lines){
    if(item && item !== "\n"){
    var tokPos=item.indexOf('|');
    var indx=tokPos>0?item.substr(0,tokPos):item;
    var patt=item.substr(tokPos+1,item.length-tokPos);
      if( tokPos < 0 || patt.length === 0 || patt == ""){
      patt=null;
      }
    rtrn[indx]=patt;
    }
  }
return rtrn;
}

//convert text lines to obj
function txtArToMObj(str){
var lines=str.split("\n");
var rtrn={};
  for(let item of lines){
    if(item && item !== "\n"){
    var tokPos=item.indexOf('|');
    var lTokPos=item.lastIndexOf('|');
    var indx=tokPos>0?item.substr(0,tokPos):item;
    var css=(lTokPos>tokPos&&lTokPos<item.length)?item.substr(lTokPos+1):item;
    var patt=item.substr(tokPos+1,lTokPos-tokPos-1);
      if( tokPos < 0 || lTokPos<=tokPos ||lTokPos+1 >= item.length|| patt.length === 0 || patt == ""){
      //do nothing, invalid
      }
      else{
      rtrn[indx]={"patt":patt, "css":css};
      }
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

function mObjToTxtAr(obj){
var rtrn="";
var nl="";
  for(var key in obj){
    if(obj[key].hasOwnProperty("patt")&& obj[key].hasOwnProperty("css")){
    rtrn+=nl+key+"|"+obj[key].patt+"|"+obj[key].css;
    }
  nl="\n";
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
      var custApplyList=document.getElementsByClassName('custApplyListTxt')[0].value;
      var custApplyListObj=txtArToObj(custApplyList);
      var custDmnPat=document.getElementsByClassName('custDmnPatTxt')[0].value;
      var custDmnPatObj=txtArToObj(custDmnPat);
      var custDmnSty=document.getElementsByClassName('custDmnStyTxt')[0].value;
      var custDmnStyObj=txtArToObj(custDmnSty);
      var custDmnStyCSS=document.getElementsByClassName('custDmnStyCSSTxt')[0].value;
      var custDmnStyCSSObj=txtArToMObj(custDmnStyCSS);
      var videoStopList=document.getElementsByClassName('videoStopList')[0].value;
      var videoStopListObj=txtArToObj(videoStopList);
      var videoStopBList=document.getElementsByClassName('videoStopBList')[0].value;
      var videoStopBListObj=txtArToObj(videoStopBList);


      console.log("==============>>");
      console.log(videoStopBListObj);

      var notif=document.getElementsByClassName('notify')[0];
      notif.id='';
      notif.innerHTML='';

        //setting custom list
        browser.storage.local.set({custList: custListObj}).then((notif)=>{saveNotify(notif, 'Ignore List saved.', false );});

        //setting the apply list
        browser.storage.local.set({custApplyList: custApplyListObj}).then((notif)=>{saveNotify(notif, 'Apply List saved.', false );});

        //setting custom domain pattern list
        browser.storage.local.set({custDmnPatList: custDmnPatObj}).then((notif)=>{saveNotify(notif, 'Custom domains and patterns saved.', true );});

        //setting custom domain style patterns list
        browser.storage.local.set({custDmnStyList: custDmnStyObj}).then((notif)=>{saveNotify(notif, 'Custom domains and styled patterns saved.', true );});

        //setting list to apply custom css
        browser.storage.local.set({custDmnStyCSSList: custDmnStyCSSObj}).then((notif)=>{saveNotify(notif, 'Custom domains and applied css for patterns saved', true );});

        //setting stop auto play video domain apply list
        browser.storage.local.set({videoStopList: videoStopListObj}).then((notif)=>{saveNotify(notif, 'Stop autoplay video domain apply list saved', true );});

        //setting stop auto play video domain ban list
        browser.storage.local.set({videoStopBList: videoStopBListObj}).then((notif)=>{saveNotify(notif, 'Stop autoplay video domain ignore list saved', true );});

      notif.id='fadeOut';
        notif.addEventListener("animationend", ()=>{
        notif.id='';
        });
      break;
      case 'export':
      browser.storage.local.get().then((item)=>{
      var custList=item.custList;

      var custApplyList=item.custApplyList;

      var custDmnPatList=item.custDmnPatList;

      var custDmnStyList=item.custDmnStyList;

      var videoStopList=item.videoStopList;
      
      var videoStopBList=item.videoStopBList;

      var custDmnStyCSSList={};
      custDmnStyCSSList=item.custDmnStyCSSList;
      document.getElementsByClassName('custListTxt')[0].value=objToTxtAr(custList);
      document.getElementsByClassName('custApplyListTxt')[0].value=objToTxtAr(custApplyList);
      document.getElementsByClassName('custDmnPatTxt')[0].value=objToTxtAr(custDmnPatList);
      document.getElementsByClassName('custDmnStyTxt')[0].value=objToTxtAr(custDmnStyList);
      document.getElementsByClassName('custDmnStyCSSTxt')[0].value=mObjToTxtAr(custDmnStyCSSList);
      document.getElementsByClassName('videoStopList')[0].value=objToTxtAr(videoStopList);
      document.getElementsByClassName('videoStopBList')[0].value=objToTxtAr(videoStopBList);

      var rtrn="Ignore List:\n"+objToTxtAr(custList)+"\n\nApply List:\n"+objToTxtAr(custApplyList)+"\n\nCustom Modal Domains and patterns (Removes element):\n"+objToTxtAr(custDmnPatList)+"\n\nCustom Style Domains and patterns (De/Re-styles element):\n"+objToTxtAr(custDmnStyList)+"\n\nApply custom css for element:\n"+mObjToTxtAr(custDmnStyCSSList)+"\n\nDomains that are ignored when \"stop auto\" is turned on. (For pages that auto play videos):\n"+objToTxtAr(videoStopBList)+"\n\nDomains that stop autoplay videos even when \"stop auto\" is turned off. (For pages that auto play videos):\n"+objToTxtAr(videoStopList);
      exportSettings(rtrn);
      });
      break;
      default:
      break;
    }
  });

}


function exportSettings( str ){
//not my code. But very clean and understandable so I;m using it
//https://stackoverflow.com/questions/33664398/how-to-download-file-using-javascript-only
var a = document.createElement("a");
a.style = "display: none";
document.body.appendChild(a);

var blob = new File([str], {type: 'text/plain'});
var url = window.URL.createObjectURL(blob);
a.href = url;
a.download = "butWhyMod_settings_backup.txt";
a.click();
window.URL.revokeObjectURL(url);
}


//getting saved settings
browser.storage.local.get().then((item) => {

    //set default
    if(!item.hasOwnProperty('mnl')){
    console.log('butWhyMod: manual setting doesn\'t exist. Setting default value.');
    item={mnl: true};
    browser.storage.local.set({mnl: true});
    }


    //gets ignorelist and custom domain modal removal class
    //also sets defaults if the variables doesn't exist.
  var custList={};
    if(item.hasOwnProperty('custList') === false){
      browser.storage.local.set({custList: {'mail.google.com': null, 'twitter.com': null }});
    custList={'mail.google.com': null, 'twitter.com': null };
    }
    else{
    custList=item.custList;
    }

  var custApplyList={};
    if(item.hasOwnProperty('custApplyList') === false){
      browser.storage.local.set({custApplyList: {}});
    custList={ };
    }
    else{
    custApplyList=item.custApplyList;
    }

  var custDmnPatList={};
    if(!item.hasOwnProperty('custDmnPatList')){
    browser.storage.local.set({custDmnPatList: {'www.facebook.com':'_5hn6'}});
    custDmnPatList={'www.facebook.com':'_5hn6'};
    }
    else{
    custDmnPatList=item.custDmnPatList;
    }

  var custDmnStyList={};
    if(!item.hasOwnProperty('custDmnStyList')){
    browser.storage.local.set({custDmnStyList: {}});
    custDmnStyList={};
    }
    else{
    custDmnStyList=item.custDmnStyList;
    }

  var custDmnStyCSSList={};
    if(!item.hasOwnProperty('custDmnStyCSSList')){
    browser.storage.local.set({custDmnStyCSSList: {}});
    custDmnStyList={};
    }
    else{
    custDmnStyCSSList=item.custDmnStyCSSList;
    }

  var videoStopList={};
    if(item.hasOwnProperty('videoStopList') === false){
      browser.storage.local.set({videoStopList: {}});
    videoStopList={};
    }
    else{
    videoStopList=item.videoStopList;
    }

  var videoStopBList={};
    if(item.hasOwnProperty('videoStopBList') === false){
      browser.storage.local.set({videoStopBList: {}});
    videoStopBList={};
    }
    else{
    videoStopBList=item.videoStopBList;
    }




 document.getElementsByClassName('custListTxt')[0].value=objToTxtAr(custList);
 document.getElementsByClassName('custApplyListTxt')[0].value=objToTxtAr(custApplyList);
 document.getElementsByClassName('custDmnPatTxt')[0].value=objToTxtAr(custDmnPatList);
 document.getElementsByClassName('custDmnStyTxt')[0].value=objToTxtAr(custDmnStyList);
 document.getElementsByClassName('custDmnStyCSSTxt')[0].value=mObjToTxtAr(custDmnStyCSSList);

 document.getElementsByClassName('videoStopList')[0].value=objToTxtAr(videoStopList);
 document.getElementsByClassName('videoStopBList')[0].value=objToTxtAr(videoStopBList);
});

//running main function
startListen();
