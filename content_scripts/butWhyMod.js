

//loading external files and settings.
(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */


  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  window.hasModaled = false;

  

  
  /*--------------------------
  pre: none
  post: none
  new fangled wait function 
  https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  ---------------------------*/
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /*----------------------
  pre: none
  post: rewrites body
  sets the main <body> tag. There's no real good reason why it should ever have overflow: hidden
  ----------------------*/
  function setBody(){
  var prevStyle=document.documentElement.getAttribute('style')?document.documentElement.getAttribute('style'):'';
  document.documentElement.setAttribute('style', prevStyle + 'overflow: auto !important; position: static !important;');

  prevStyle=document.body.getAttribute('style')?document.body.getAttribute('style'):'';
  document.body.setAttribute('style', prevStyle + 'overflow: auto !important; position: static !important;');
    if(document.body.className.match(/modal/ig)){
    //document.body.className="";
    }
  }


  /*----------------------
  pre: none
  post: modifies html
  made to run with 
  -----------------------*/
  function disableBackdrop(objArr){
    for(let obj of objArr){
      if(obj.className.match(/(backdrop|veil|lightbox|shroud)/ig)){
      obj.setAttribute('style', 'display: none !important; z-index: -9999999999999 !important;');
      }
    }

  }


  /*------------------------
  pre: none
  post: div's with modals 
  goes through the object array of objArr from getElementsByTagName and 
  sets a style on it (namely display: none; z-index:-99999999)
  _5hn6 is strictly for facebook
  ------------------------*/
  function disableModal(objArr, regexStr='(modal|backdrop|alert|cookie|lightbox|veil|fancybox|social-connect|banner|sp_)', regexStrB='(blur)'){
    if(regexStr==='undefined' || regexStr===null){
    var regexPatt = new RegExp('(modal|backdrop|alert|cookie|lightbox|veil|fancybox|social-connect|banner|sp_)', "ig");
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
        var classN=obj.className.match(regexPatt);
        var idN=obj.id.match(regexPatt);
      if(classN || idN){
        var idClass=classN?"class name":"id name";
        var objname=idClass=="class name"?obj.className:obj.id;
      console.log("butWhyMod: found potential modal or modal-related object with " + idClass + " \"" + objname + "\". Don't like it. Making it go away...");
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
  }

  /*------------------------
  pre: none
  post: none
  runs the entire rewrite function
  -------------------------*/
  function pageDone(){
  console.log("butWhyMod: Document status: " +  document.readyState);
    var objArr = document.getElementsByTagName("div");
    console.log("butWhyMod: starting butWhyMod. " + objArr.length + " objects to go through");

    setBody();

    //runs custom domain pattern modal removals.
    chrome.storage.local.get(null, (item) => {
    var custDmnPatList=item.hasOwnProperty('custDmnPatList')?item.custDmnPatList:"";
    var custDmnStyList=item.hasOwnProperty('custDmnStyList')?item.custDmnStyList:"";
      if(custDmnPatList.hasOwnProperty(window.location.host) || custDmnStyList.hasOwnProperty(window.location.host)){
      var conslPat=custDmnPatList.hasOwnProperty(window.location.host)?"modal pattern: \"" + custDmnPatList[window.location.host] + "\" ":'';
      conslPat=conslPat + custDmnStyList.hasOwnProperty(window.location.host)?" style pattern: \"" + custDmnStyList[window.location.host] + "\" ":'';
      console.log("butWhyMod: Applying custom domain pattern to custom domain. Domain: " + window.location.host + ", " + conslPat);
      disableModal(objArr, custDmnPatList[window.location.host], custDmnStyList[window.location.host]); 
      }
    });

    //standard modal disable
    disableModal(objArr);	
  }


  /*-----------------------
  pre: pageDone()
  post: none
  runs pageDone after "secs" amount of time
  -----------------------*/
  async function delayRun(secs=6500) {

    console.log('butWhyMod: Setting time for delayed modal removal for ' + secs + " milliseconds");
    await sleep(secs);
    console.log('butWhyMod: Time\'s up. Running delayed modal removal.');
    pageDone();
  }

  /*--------------------
  pre: everything above here
  post: everything modified as a result of running functions above here
  the main logic for what to do when a message comes in from the popup menu
  ---------------------*/
  function runOnMsg(request, sender, sendResponse){
    switch(request.action){
      case 'disableMdl':
        console.log('butWhyMod: manual disable of modals');
        pageDone();
      break;
      default:
      break;
    }


  }


  //runs at the start of every page
  chrome.storage.local.get(null, (item) => {

    //set default
    if(!item.hasOwnProperty('mnl')){
    console.log('butWhyMod: manual setting doesn\'t exist. Setting default value.');
    item={mnl: true};
    chrome.storage.local.set({mnl: true}); 
    }

    //gets ignorelist, custom domain modal removal class and custom domain style removal/restyle class
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

  var custDmnStyList={};
    if(!item.hasOwnProperty('custDmnStyList')){
    chrome.storage.local.set({custDmnStyList: {}});
    custDmnStyList={};
    }
    else{
    custDmnStyList=item.custDmnStyList;
    }

  var dmn=window.location.host;
    
 
    if(item['mnl'] === false){

    //if dmn in custList, do nothing
    if(custList.hasOwnProperty(dmn)){
    console.log('butWhyMod: Current URL\'s domain in ignore list. Not removing modals. ' + dmn);
    return null;
    } 

    console.log('butWhyMod: Automatic pruning set. Starting removal of modal.');
    console.log('butWhyMod: Preliminary modal removal...');
    pageDone();
    console.log('butWhyMod: adding event listener for removal on page complete.');
    document.addEventListener('readystatechange', event => {
      if (event.target.readyState === 'complete') {
      console.log("butWhyMod: Page done loading. Trying to remove modals. Document state: " + document.readyState);
      pageDone();
      }
    });
    delayRun();
    }
    else{
    console.log('butWhyMod: Manual pruning set. No modal removal.');
    }
  });

  chrome.runtime.onMessage.addListener(runOnMsg);
})();




