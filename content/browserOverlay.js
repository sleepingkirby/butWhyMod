/**
 * butWhyMod namespace.
 */
//writes to both browser and error console.
//Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService).logStringMessage("test");
if ("undefined" == typeof(butWhyMod)) {
  var butWhyMod = {

    init : function(){
    console.log("==============>> on init");
    console.log(document.documentElement.innerHTML);
    },
    sayHello : function(aEvent) {
    }
  }

 butWhyMod.init();
};

gBrowser.addEventListener("load", function () {
    console.log("==============>> on event");
    console.log(document.documentElement.innerHTML);
    console.log(gBrowser.selectedTab.body.innerHTML);
}, true);

