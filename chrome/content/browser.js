/**
 * butWhyMod namespace.
 *
 * writes to both browser and error console.
 * Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService).logStringMessage("test");
**/
var butWhyModObj = {
  curWin: null,
  prefMng: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
  log:function(str){
  Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService).logStringMessage(str);
  },
  init : function(){

    //if( typeof gBrowser!='undefined' && gBrowser != null && gBrowser.hasOwnProperty('getBrowswerForTab')){
    if( typeof gBrowser!='undefined' && gBrowser != null){
      gBrowser.addEventListener("load", function () {

      var mnlBool=butWhyModObj.getMnlTxt();//not sure why this.getMnlTxt() is not found here. but using butWhyModObj.getMnlTxt() exists for it for some reason
      document.getElementById('butWhyModMnlBt').label=mnlBool;//setting toolbar button manual/auto prune label 

        //get and save the window being used
        butWhyModObj.curWin = gBrowser.getBrowserForTab(gBrowser.selectedTab);
          var item={};


          item['mnl']=butWhyModObj.prefMng.getBoolPref('extensions.butWhyMod.mnl');
          item['custList']=JSON.parse(butWhyModObj.prefMng.getCharPref('extensions.butWhyMod.custList'));
          item['custDmnPatList']=JSON.parse(butWhyModObj.prefMng.getCharPref('extensions.butWhyMod.custDmnPatList'));
          item['custDmnStyList']=JSON.parse(butWhyModObj.prefMng.getCharPref('extensions.butWhyMod.custDmnStyList'));


          //------------------------ actual removal ------------------
          var dmn='';

          try{
          dmn=butWhyModObj.curWin.currentURI.host;
          }
          catch(err){
          butWhyModObj.log(err);
          //this happens when at a page with no host. Pages like about:config or about:addons. In case, just do nothing.
          return null;
          }

          if(item['custList'].hasOwnProperty(dmn)){
          console.log('butWhyMod: Current URL\'s domain in ignore list. Not removing modals. ' + dmn);
          return null;
          }

          if(item['mnl'] === false){
          console.log('butWhyMod: Automatic pruning set. Starting removal of modal.');
          console.log('butWhyMod: Preliminary modal removal...');
          butWhyModObj.pageDone(dmn);
          console.log('butWhyMod: adding event listener for removal on page complete.');
          butWhyModObj.curWin.addEventListener('readystatechange', event => {
            if (event.target.readyState === 'complete') {
            console.log("butWhyMod: Page done loading. Trying to remove modals. Document state: " + event.target.readyState);
            butWhyModObj.pageDone();
            }
          });

          butWhyModObj.delayRun();
          }
          else{
          console.log('butWhyMod: Manual pruning set. No modal removal.');
          }
      }, true);
    }
  },
  txtArToObj: function(str){
  var lines=str.split("\n");
  var rtrn={};
    for(let item of lines){
      if(item && item !== "\n" && item.length > 0){
      var objs=item.split('|');
        if(objs[1] === undefined){
        objs[1]=null;
        }
        rtrn[objs[0]]=objs[1];
      }
    }
  return rtrn;
  },
  objToTxtAr: function(obj){
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
  },
  getPrefs: function(){
  //gets all the settings for the options page.
  var rtrn={};
    rtrn['custList']=this.objToTxtAr(JSON.parse(this.prefMng.getCharPref('extensions.butWhyMod.custList')));
    rtrn['custDmnPatList']=this.objToTxtAr(JSON.parse(this.prefMng.getCharPref('extensions.butWhyMod.custDmnPatList')));
    rtrn['custDmnStyList']=this.objToTxtAr(JSON.parse(this.prefMng.getCharPref('extensions.butWhyMod.custDmnStyList')));
  return rtrn;
  },
  setPrefs: function(){
  //gets the prefs from the options page and saves it. 
  //meant for use by the options page only.
  var custList=document.getElementById('butWhyModCustListTB').value;
  var custDmnPatList=document.getElementById('butWhyModCustDmnPatListTB').value;
  var custDmnStyList=document.getElementById('butWhyModCustDmnStyListTB').value;
  custList=this.txtArToObj(custList);
  custList=JSON.stringify(custList);
  custDmnPatList=this.txtArToObj(custDmnPatList);
  custDmnPatList=JSON.stringify(custDmnPatList);
  custDmnStyList=this.txtArToObj(custDmnStyList);
  custDmnStyList=JSON.stringify(custDmnStyList);

    this.prefMng.setCharPref('extensions.butWhyMod.custList', custList);
    this.prefMng.setCharPref('extensions.butWhyMod.custDmnPatList', custDmnPatList);
    this.prefMng.setCharPref('extensions.butWhyMod.custDmnStyList', custDmnStyList);
  },
  getMnlTxt:function(btBool, id){
  //sets the manual/auto prune button display in the toolbar button menu.
    if( typeof id === undefined || id === null){
    id='butWhyModMnlBt';
    }
    var mnlBool=true;
    if(typeof btBool === undefined || btBool === null || btBool === undefined){
    mnlBool=this.prefMng.getBoolPref('extensions.butWhyMod.mnl');
    }
    else{
    mnlBool=btBool;
    }
  var mnlLbl={false: 'auto prune', true: 'manual prune'};
  return mnlLbl[mnlBool];
  },
  flipMnlBt:function(){
  // flip the mnl boolean and sets the auto prune/manual prune button
  var mnlBool=this.prefMng.getBoolPref('extensions.butWhyMod.mnl');
  //grabs the current setting. Corrects the setting if incorrect. Flips the value.
    if(typeof mnlBool===undefined || mnlBool===null|| !mnlBool || mnlBool===undefined){
    mnlBool=false;
    }
    else{
    mnlBool=true;
    }

  mnlBool=!mnlBool;
  this.prefMng.setBoolPref('extensions.butWhyMod.mnl', mnlBool);
  var lblStr=this.getMnlTxt(mnlBool);
  return lblStr;
  },
  sleep:function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  setBody: function(){

  var prevStyle=this.curWin.contentDocument.documentElement.getAttribute('style')?this.curWin.contentDocument.documentElement.getAttribute('style'):'';
  this.curWin.contentDocument.documentElement.setAttribute('style', prevStyle + 'overflow: auto !important; position: static !important;');

  prevStyle=this.curWin.contentDocument.body.getAttribute('style')?this.curWin.contentDocument.body.getAttribute('style'):'';
  this.curWin.contentDocument.body.setAttribute('style', prevStyle + 'overflow: auto !important; position: static !important;');
    if(this.curWin.contentDocument.body.className.match(/modal/ig)){
    //document.body.className="";
    }
  },
  disableBackdrop: function(objArr){
    for(let obj of objArr){
      if(obj.className.match(/(backdrop|veil|lightbox)/ig)){
      obj.setAttribute('style', 'display: none !important; z-index: -9999999999999 !important;');
      }
    }
  },
  disableModal: function(objArr, regexStr='(modal|backdrop|alert|cookie|lightbox|veil|fancybox|social-connect|banner|sp_)', regexStrB='(blur)'){
    if(regexStr==='undefined' || regexStr===null){
    var regexPatt = new RegExp('(modal|backdrop|alert|cookie|lightbox|veil|fancybox|sp_)', "ig");
    }
    else{
    var regexPatt = new RegExp(regexStr, "ig");
    }

    if(regexStrB==='undefined' || regexStrB===null){
    var regexPattB = new RegExp('(blur)', "ig");
    }
    else{
    var regexPattB = new RegExp(regexStrB, "ig");
    }



    for(let obj of objArr){
      //modal or veil
      if(obj.className.match(regexPatt) || obj.id.match(regexPatt)){
      console.log("butWhyMod: found potential modal or modal-related object with classname \"" + obj.className + "\". Don't like it. Making it go away...");
      obj.setAttribute('style', 'display: none !important; z-index: -9999999999999 !important;');
      obj.className="dontCare";
      obj.id="dontCare";
      }
      //stuff that needs style only removed like filters
      else if( obj.className.match(regexPattB)){
      console.log("butWhyMod: found styled object with classname \"" + obj.className + "\". De/Restyling...");
      obj.setAttribute('style', 'filter: none !important; position: static !important;');
      }
    }
  },
  sleep:function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  delayRun:async function(secs=6500) {

    console.log('butWhyMod: Setting time for delayed modal removal for ' + secs + " milliseconds");
    await this.sleep(secs);
    console.log('butWhyMod: Time\'s up. Running delayed modal removal.');
    this.pageDone();
  },
  pageDone:function(){

  this.curWin=gBrowser.getBrowserForTab(gBrowser.selectedTab);
    try{
    var host=gBrowser.getBrowserForTab(gBrowser.selectedTab).currentURI.host;
    }
    catch(err){
    this.log(err);
    //this happens when at a page with no host. Pages like about:config or about:addons. In case, just do nothing.
    return null;
    }

  console.log("butWhyMod: Document status: " + this.curWin.contentDocument.readyState);
  var objArr = this.curWin.contentDocument.documentElement.getElementsByTagName("div");
  console.log("butWhyMod: starting butWhyMod. " + objArr.length + " objects to go through");

  this.setBody();

    //runs custom domain pattern modal removals.
  var custDmnPatList=JSON.parse(butWhyModObj.prefMng.getCharPref('extensions.butWhyMod.custDmnPatList'));
  var custDmnStyList=JSON.parse(butWhyModObj.prefMng.getCharPref('extensions.butWhyMod.custDmnStyList'));
    if(custDmnPatList.hasOwnProperty(host) || custDmnStyList.hasOwnProperty(host)){
    var conslPat=custDmnPatList.hasOwnProperty(host)?"modal pattern: \"" + custDmnPatList[host] + "\" ":'';
    conslPat=conslPat + custDmnStyList.hasOwnProperty(host)?" style pattern: \"" + custDmnStyList[host] + "\" ":'';
    console.log("butWhyMod: Applying custom domain pattern to custom domain. Domain: " + host + ", " + conslPat);
    this.disableModal(objArr, custDmnPatList[host], custDmnStyList[host]);
    }

  //standard modal disable
  this.disableModal(objArr);
 
  },
  whiteList:function(){
  var ignList=JSON.parse(this.prefMng.getCharPref('extensions.butWhyMod.custList'));
  this.curWin = gBrowser.getBrowserForTab(gBrowser.selectedTab);
  var dmn=this.curWin.currentURI.host;
  console.log("Adding white list domain: "+dmn);
    if(dmn){
    ignList[dmn]=null;
    ignList=JSON.stringify(ignList);
    this.prefMng.setCharPref('extensions.butWhyMod.custList', ignList);
    }
  },
  openCenterWin:function(loc, title){
  //chrome://butwhymod/content/options.xul
  //butWhyMod Options
  var width=440;
  var height=460;
  var left=(window.screenX)+(window.screen.width/2)-(width/2);
  var tops=(window.screen.height/2)-(height/2);
  window.open(loc, title,'toolbars=0,width='+width+'px,height='+height+'px,left='+left+',top='+tops);
  }
}


butWhyModObj.init();

//butWhyModObj.addToToolBar("nav-bar", "butWhyMod-toolbar-button");
//butWhyModObj.addToToolBar("addon-bar", "butWhyMod-toolbar-button");

/*

gBrowser.addEventListener("load", function () {
    console.log("==============>> on event");
// Add tab, then make active
//gBrowser.selectedTab = gBrowser.addTab("http://www.google.com/");

  var newTabBrowser = gBrowser.getBrowserForTab(gBrowser.selectedTab);

  newTabBrowser.addEventListener("load", function (){
    console.log(newTabBrowser.contentDocument.readyState);
    //console.log(newTabBrowser.contentDocument.documentElement.innerHTML);
    //newTabBrowser.contentDocument.documentElement.setAttribute('style', 'border: 9px solid blue;');
  }, true);


}, true);
*/

