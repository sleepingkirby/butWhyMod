/**
 * butWhyMod namespace.
 */
if ("undefined" == typeof(butWhyMod)) {
  var butWhyMod = {

    init : function(){
    console.log("==============>> on init");
document.documentElement.setAttribute('style', 'border: 8px solid blue;');
    },
    sayHello : function(aEvent) {
    }
  }

 butWhyMod.init();
};

gBrowser.addEventListener("load", function () {
  document.documentElement.setAttribute('style', 'border: 8px solid red;');
}, true);

  document.documentElement.setAttribute('style', 'border: 8px solid green;');
