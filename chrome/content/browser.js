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
  //get settings
  //if no settings exist, set defaults.
  console.log("butWhyMod: Starting butWhyMod.");

    //this.addToToolBar("nav-bar", "butWhyMod-toolbar");
    // The "addon-bar" is available since Firefox 4
    //this.installButton("addon-bar", "my-extension-addon-bar-button");

    if( typeof gBrowser!='undefined' && gBrowser != null && gBrowser.hasOwnProperty('getBrowswerForTab')){
    console.log(gBrowser.hasOwnProperty('getBrowswerForTab'));
      gBrowser.addEventListener("load", function () {
        console.log("==============>> on event");

        //get and save the window being used
        this.curWin = gBrowser.getBrowserForTab(gBrowser.selectedTab);

          this.curWin.addEventListener("load", function (){
          //console.log(newTabBrowser.contentDocument.readyState);
          //console.log(newTabBrowser.contentDocument.documentElement.innerHTML);
          //newTabBrowser.contentDocument.documentElement.setAttribute('style', 'border: 9px solid blue;');
          }, true);
      }, true);
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

