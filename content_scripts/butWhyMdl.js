
//document.addEventListener('readystatechange', () => console.log("=========>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + document.readyState));

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
  document.body.setAttribute('style', 'overflow: auto !important');
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
      if(obj.className.match(/backdrop/ig)){
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
  function disableModal(objArr, regexStr='(modal|backdrop|alert)'){
    if(regexStr==='undefined' || regexStr===null){
    var regexPatt = new RegExp('(modal|backdrop|alert)', "ig");
    }
    else{
    var regexPatt = new RegExp(regexStr, "ig");
    }

    for(let obj of objArr){
      if(obj.className.match(regexPatt)){
      console.log("butWhyMdl: found object with classname \"" + obj.className + "\". Don't like it. Making it go away...");
      obj.setAttribute('style', 'display: none !important; z-index: -9999999999999 !important;');
      obj.className="dontCare";
      obj.id="dontCare";
      }
    }
  }

  /*------------------------
  pre: none
  post: none
  runs the entire rewrite function
  -------------------------*/
  function pageDone(){
  console.log("butWhyMdl: Document status: " +  document.readyState);
    var objArr = document.getElementsByTagName("div");
    console.log("butWhyMdl: starting butWhyMdl. " + objArr.length + " objects to go through");

    setBody();

    //runs custom domain pattern modal removals.
    browser.storage.local.get().then((item) => {
    var custDmnPatList=item.hasOwnProperty('custDmnPatList')?item.custDmnPatList:"";
      if(custDmnPatList.hasOwnProperty(window.location.host)){
      console.log("butWhyMdl: Applying custom domain pattern to custom domain. Domain: " + window.location.host + ", pattern: " +custDmnPatList[window.location.host]);
      disableModal(objArr, custDmnPatList[window.location.host]);	
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

    console.log('butWhyMdl: Setting time for delayed modal removal for ' + secs + " milliseconds");
    await sleep(secs);
    console.log('butWhyMdl: Time\'s up. Running delayed modal removal.');
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
        console.log('butWhyMdl: manual disable of modals');
        pageDone();
      break;
      default:
      break;
    }


  }


  //runs at the start of every page
  browser.storage.local.get().then((item) => {

    //set default
    if(!item.hasOwnProperty('mnl')){
    console.log('butWhyMdl: manual setting doesn\'t exist. Setting default value.');
    item={mnl: false};
    browser.storage.local.set({mnl: false}); 
    }

    //gets ignorelist and custom domain modal removal class
    //also sets defaults if the variables doesn't exist.
  var custList={};
    if(!item.hasOwnProperty('custList')){
    browser.storage.local.set({custList: {'mail.google.com': undefined}});
    custList={'mail.google.com': undefined};
    } 
    else{
    cusList=item.custList;
    }

  var custDmnPatList={};
    if(!item.hasOwnProperty('custDmnPatList')){
    browser.storage.local.set({custDmnPatList: {'www.facebook.com':'_5hn6'}});
    custDmnPatList={'www.facebook.com':'_5hn6'};
    }
    else{
    custDmnPatList=item.custDmnPatList;
    }

  var dmn=window.location.host;
    
    //if dmn in custList, do nothing
    if(custList.hasOwnProperty(dmn)){
    console.log('butWhyMdl: Current URL\'s domain in ignore list. Not removing modals. ' + dmn);
    return null;
    } 

 
    if(item['mnl'] === false){
    console.log('butWhyMdl: Automatic pruning set. Starting removal of modal.');
    console.log('butWhyMdl: Preliminary modal removal...');
    pageDone();
    console.log('butWhyMdl: adding event listener for removal on page complete.');
    document.addEventListener('readystatechange', event => {
      if (event.target.readyState === 'complete') {
      console.log("butWhyMdl: Page done loading. Trying to remove modals. Document state: " + document.readyState);
      pageDone();
      }
    });
    delayRun();
    }
    else{
    console.log('butWhyMdl: Manual pruning set. No modal removal.');
    }
  });

  browser.runtime.onMessage.addListener(runOnMsg);
})();




