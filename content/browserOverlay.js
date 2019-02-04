/**
 * butWhyMod namespace.
 */
//writes to both browser and error console.
//Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService).logStringMessage("test");
if ("undefined" == typeof(butWhyMod)) {
  var butWhyMod = {
  curWin: gBrowser.getBrowserForTab(gBrowser.selectedTab),
    init : function(){
    //get settings
    //if no settings exist, set defaults.
    console.log("butWhyMod: Starting butWhyMod.");
    }
  };

 butWhyMod.init();
};


butWhyMod.curWin.addEventListener("complete", function (){

    console.log("==============>> on event");
});


/*
gBrowser.addEventListener("load", function () {
    console.log("==============>> on event");
// Add tab, then make active
//gBrowser.selectedTab = gBrowser.addTab("http://www.google.com/");

  var newTabBrowser = gBrowser.getBrowserForTab(gBrowser.selectedTab);

  newTabBrowser.addEventListener("complete", function (){
    console.log(newTabBrowser.contentDocument.readyState);
    console.log(newTabBrowser.contentDocument.documentElement.innerHTML);
    newTabBrowser.contentDocument.documentElement.setAttribute('style', 'border: 9px solid blue;');
  }, true);


}, true);
*/

