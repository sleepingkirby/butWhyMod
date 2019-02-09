/**
 * butWhyMod namespace.
 *
 * writes to both browser and error console.
 * Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService).logStringMessage("test");
**/
var butWhyModObj = {
  curWin: null,
  prefMng: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
  init : function(){
  console.log("butWhyMod: Starting butWhyMod.");

    //if( typeof gBrowser!='undefined' && gBrowser != null && gBrowser.hasOwnProperty('getBrowswerForTab')){
    if( typeof gBrowser!='undefined' && gBrowser != null){
    console.log(gBrowser.hasOwnProperty('getBrowswerForTab'));
      gBrowser.addEventListener("load", function () {
      if(gBrowser.hasOwnProperty('getBrowswerForTab')){
        var mnlBool=butWhyModObj.getMnlTxt();//not sure why this.getMnlTxt() is not found here. but using butWhyModObj.getMnlTxt() exists for it for some reason
        document.getElementById('butWhyModMnlBt').label=mnlBool;//setting toolbar button manual/auto prune label 

          //get and save the window being used
          this.curWin = gBrowser.getBrowserForTab(gBrowser.selectedTab);

            this.curWin.addEventListener("load", function (){
            //console.log(newTabBrowser.contentDocument.readyState);
            //console.log(newTabBrowser.contentDocument.documentElement.innerHTML);
            //newTabBrowser.contentDocument.documentElement.setAttribute('style', 'border: 9px solid blue;');


            }, true);
        }, true);
      }
    }
  },
  testfunc: function(){
  console.log("test fnct");
  },
  txtArToObj: function(str){
  var lines=str.split("\n");
  var rtrn={};
    for(let item of lines){
      if(item !== "\n"){
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
    rtrn['custDmnPatLst']=this.objToTxtAr(JSON.parse(this.prefMng.getCharPref('extensions.butWhyMod.custDmnPatList')));
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
  console.log("===getMnlTxt==>>");
  console.log(mnlBool);
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

