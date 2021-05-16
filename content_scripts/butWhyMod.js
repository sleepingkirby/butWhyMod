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

  var curVidEl=null;
  var curEl=null;
  var dmn=null;  

  
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

    if(document.body){
    prevStyle=document.body.getAttribute('style')?document.body.getAttribute('style'):'';
    document.body.setAttribute('style', prevStyle + 'overflow: auto !important; position: static !important;');
      if(document.body.className.match(/modal/ig)){
      //document.body.className="";
      }
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
      if(typeof obj=="object"&&obj&&(obj.getAttribute("class")||obj.getAttribute("id"))){
        var classN=obj.hasAttribute("class")?obj.getAttribute("class").match(regexPatt):false;
        var idN=obj.hasAttribute("id")?obj.getAttribute("id").match(regexPatt):false;
        if(classN || idN){
          var idClass=classN?"class name":"id name";
          var objname=idClass=="class name"?obj.getAttribute("class"):obj.getAttribute("id");
        console.log("butWhyMod: found potential modal or modal-related object with " + idClass + " \"" + objname + "\". Don't like it. Making it go away...");
        obj.setAttribute('style', 'display: none !important; z-index: -9999999999999 !important;');
        obj.className="dontCare";
        obj.id="dontCare";
        }
        //stuff that needs style only removed like filters
        else if(obj.hasAttribute("class") && obj.getAttribute("class").match(regexPattB)){
        console.log("butWhyMod: found styled object with classname \"" + obj.getAttribute("class") + "\". De/Restyling...");
        obj.setAttribute('style', 'filter: none !important; position: static !important;'); 
        }
      }
    }
  }

  /*------------------------------------
  pre: custDmnStyCSSList obj
  post: page elements that applies styled
  styles the elements in question
  ------------------------------------*/
  function styleEls(objArr, regexStr, css){
    if(regexStr==='undefined' || regexStr===null || regexStr==""){
    //if no pattern, nothing to match
    return null;
    }
    if(css==='undefined' || css===null|| css==""){
    //if no css, there's nothing to style
    return null;
    }

    var regexPatt = new RegExp(regexStr, "ig");


    for(let obj of objArr){
      //modal or veil
        var classN=obj.className.match(regexPatt);
        var idN=obj.id.match(regexPatt);
      if(classN || idN){
        var idClass=classN?"class name":"id name";
        var objname=idClass=="class name"?obj.className:obj.id;
      console.log("butWhyMod: found potential element to be styled " + idClass + " \"" + objname + "\". Applying deemed css style...");
      obj.style.cssText=css;
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
    //var objArr = document.getElementsByTagName("div");
    var objArr = document.all;
    console.log("butWhyMod: starting butWhyMod. " + objArr.length + " objects to go through");

    setBody();

    //runs custom domain pattern modal removals.
    chrome.storage.local.get(null, (item) => {
    var custDmnPatList=item.hasOwnProperty('custDmnPatList')?item.custDmnPatList:"";
    var custDmnStyList=item.hasOwnProperty('custDmnStyList')?item.custDmnStyList:"";
    var custDmnStyCSSList=item.hasOwnProperty('custDmnStyCSSList')?item.custDmnStyCSSList:"";
      if(custDmnPatList.hasOwnProperty(window.location.host) || custDmnStyList.hasOwnProperty(window.location.host)){
      var conslPat=custDmnPatList.hasOwnProperty(window.location.host)?"modal pattern: \"" + custDmnPatList[window.location.host] + "\" ":'';
      var conslSty =  custDmnStyList.hasOwnProperty(window.location.host)?" style pattern: \"" + custDmnStyList[window.location.host] + "\" ":'';
      conslPat=conslPat + conslSty;
      console.log("butWhyMod: Applying custom domain pattern to custom domain. Domain: " + window.location.host + ", " + conslPat);
      disableModal(objArr, custDmnPatList[window.location.host], custDmnStyList[window.location.host]); 
      }
      if(custDmnStyCSSList.hasOwnProperty(window.location.host)){
      //run custome styling
      styleEls(objArr, custDmnStyCSSList[window.location.host].patt, custDmnStyCSSList[window.location.host].css);
      }
    });

    //standard modal disable
    disableModal(objArr);	
  }


  /*------------------------------------------
  pre:none
  post HTMLVideoElement.prototype.play is 
  backed up and overwritten with fake function
  description: injects code into page to override
  and disable play() on videos;
  -------------------------------------------*/
  function stopVideoPlay(){
  var injectedCode = '(' + function() {
    HTMLVideoElement.prototype.bwmBkupPlay=HTMLVideoElement.prototype.play;
    HTMLVideoElement.prototype.play=function(e){
    console.log("ButWhyMod: An attempt was made to play a video");
      if(document.querySelector("button.ytp-play-button.ytp-button")){
      document.querySelector("button.ytp-play-button.ytp-button").click();
      }
    }
  } + ')();';

  var s = document.createElement('script');
  s.textContent = injectedCode;
  (document.head || document.documentElement).appendChild(s);
  s.parentNode.removeChild(s);
  }


  /*-------------------------------------------------------------------
  pre: stopVideoPlay();
  post: reverses the what stopVideoPlay() did
  reverses the what stopVideoPlay() did
  -------------------------------------------------------------------*/
  function resumeVideoPlay(){

  var injectedCode = '(' + function() {
    if(HTMLVideoElement.prototype.hasOwnProperty("bwmBkupPlay")){
    HTMLVideoElement.prototype.play=HTMLVideoElement.prototype.bwmBkupPlay;
    delete HTMLVideoElement.prototype.bwmBkupPlay;
    console.log("ButWhyMod: Resume Play Ability.");
    }
  } + ')();';

  var s = document.createElement('script');
  s.textContent = injectedCode;
  (document.head || document.documentElement).appendChild(s);
  s.parentNode.removeChild(s);
  }

  /*-----------------------------------------------------------------------
  pre: none
  post: none
  determines if trgt is a video and return if it is. If it's not, check to see if it's an iframe
  if it's an iframe try to find the first visible video and return that.
  All other cases return null;
  -----------------------------------------------------------------------*/
  function seekVidEl(trgt){
    if(!trgt||typeof trgt!="object"){
    return null;
    }

    if(trgt.tagName.toLocaleLowerCase()=="video"){
    return trgt;
    }

    //check previous and next sibling
    if(trgt.previousElementSibling && trgt.previousElementSibling.tagName.toLocaleLowerCase()=="video"){
    return trgt.previousElementSibling;
    }

    if(trgt.nextElementSibling&&trgt.nextElementSibling.tagName.toLocaleLowerCase()=="video"){
    return trgt.nextElementSibling;
    }


    if(trgt.tagName.toLocaleLowerCase()!="iframe"){
    return null;
    }
   
  var el=null;
    
    if(!trgt.contentDocument||!trgt.contentDocument.body){
    return null;
    }

    el=trgt.contentDocument.body;
    
  var obj=el.getElementsByTagName("video");
  var m=obj.length;
    for(let i=0;i<m;i++){
      if(obj[i].style.display&&obj[i].style.display!="none"){
      return obj[i];
      }
    }

  return null;
  }


  /*-----------------------------------------------
  pre: none
  post: none
  function to skip video to the end
  -----------------------------------------------*/
  function skipVidToEnd(){
    if(curVidEl){
    console.log("ButWhyMod: Video duraction: "+curVidEl.duration);
      if(curVidEl.duration<=Number.MAX_SAFE_INTEGER&&curVidEl.duration>=0){
      curVidEl.currentTime=curVidEl.duration;
      }
      else{
      curVidEl.currentTime=Number.MAX_SAFE_INTEGER;
      }
    curVidEl.dispatchEvent(new Event("ended"));
    }
  } 

  

  /*-----------------------------------------------
  pre: global var curVidEl, curEl and dmn
  post:
  evalutes as to what actions to do for the video stuff
  -----------------------------------------------*/
  function videoStopEval(mngTgl, stopTgl, stopList, stopBList){
  /*
  if mngTgl, allows for mouse over on any video to give an option to skip the video
  */

  /*
  create element 
  element.onclick=function to seek out video element and set currentTime=duration
  */

  var el=document.createElement("div");
  el.style.cssText="position:absolute;color:#B4B4B4;background-color:rgba(0,0,0,0.6);border-radius:0px 4px 4px 0px;padding:6px 14px 6px 14px;font-weight:800;font-size:larger;z-index:999999;cursor:pointer;";
  el.id="butWhyModSkipEndEl";
  el.innerText="SKIP";
  el.bwmAct="skipVid";


    if(mngTgl){
      document.addEventListener("click", (e)=>{
        if(e.target.hasOwnProperty("bwmAct")){
          switch(e.target.bwmAct){
            case el.bwmAct:
            skipVidToEnd();
            break;
            default:
            break;
          }
        }
      });

    var on=null;

      document.addEventListener("mouseover", (e)=>{
        on=seekVidEl(e.target);
        //if target is a video or the el element, add and/or reposition the el element
        if(on||e.target.id==el.id){

        //setting global var curVidEl to current video element so other functions can find/control it
        curVidEl=on?on:curVidEl;

        //setting global var curEl to current element so other function can find/control it
        curEl=e.target;

        //restoring play functionality if it's been disabled by stopVideoPlay()
        //resumeVideoPlay();

          if(!document.getElementById(el.id)){
          //console.log("adding element");
          document.body.appendChild(el);
          }
        
          if(on){
          var pos=curEl.getBoundingClientRect();
          /*
          removing this for now until I see a real world example for it
          because there's no good way to communicate that the video element returned from seekVidEl is from within an iframe 
          var subPos={x:0,y:0};
            //the video could be in an iframe. If so, look for the video
            if(curEl.tagName.toLocaleLowerCase()=="iframe"){
            subPos=on.getBoundingClientRect();
            }
          el.style.left=window.scrollX+pos.x+subPos.x+"px";
          el.style.top=window.scrollY+pos.y+subPos.y+"px";
          */
          el.style.left=window.scrollX+pos.x+"px";
          el.style.top=window.scrollY+pos.y+Math.floor(pos.height/4)+"px";
          //console.log(pos.x+", "+pos.y);
          //console.log(el.style.left+", "+el.style.top);
          }
        }
        else{
          if(e.target&&e.target.id!=el.id&&document.getElementById(el.id)){
            try{
            document.body.removeChild(el);
            }
            catch(e){
            console.log("butWhyMod: Unable to remove skip button. This is okay: "+e);
            }
          }
        }
      });

      //adjust el when window resizes
      window.addEventListener("resize",(e)=>{
        if(document.getElementById(el.id)){
        var pos=curEl.getBoundingClientRect();
        var subPos={x:0,y:0};

        /*removing iframe video position until I a real world example of it
          //the video could be in an iframe. If so, look for the video
          if(curEl.tagName.toLocaleLowerCase()=="iframe"){
          subPos=on.getBoundingClientRect();
          }
        el.style.left=window.scrollX+pos.x+subPos.x+"px";
        el.style.top=window.scrollY+pos.y+subPos.y+"px";
        */

        el.style.left=window.scrollX+pos.x+subPos.x+"px";
        el.style.top=window.scrollY+pos.y+Math.floor(pos.height/4)+"px";
        }
      });

    }

  dmn=window.location.host;
  //handling how to the how to stop auto play
  //stopTgl, stopList, stopBList
  /*
    console.log("===========================>> stop auto play");
    console.log(stopTgl);
    console.log(dmn);
    console.log("stopBList:"+stopBList.hasOwnProperty(dmn));
    console.log(stopBList);
    console.log("stopList:"+stopList.hasOwnProperty(dmn));
    console.log(stopList);    
  */

    if((stopTgl&&!stopBList.hasOwnProperty(dmn))||(!stopTgl&&stopList.hasOwnProperty(dmn))){
      stopVideoPlay();
      //sets the event listener to restore video playing
      document.addEventListener("mouseover", (e)=>{
        if(seekVidEl(e.target)||e.target.id==el.id){
        //restoring play functionality if it's been disabled by stopVideoPlay()
        resumeVideoPlay();
        }
      });
    }
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

  
//=====================================runs at the start of every page=======================
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

  var applyList={};
    if(item.hasOwnProperty('custApplyList') === false){
      chrome.storage.local.set({custApplyList: {}});
    applyList={};
    } 
    else{
    applyList=item.custApplyList;
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

  var custDmnStyCSSList={};
    if(!item.hasOwnProperty('custDmnStyCSSList')){
    chrome.storage.local.set({custDmnStyCSSList: {}});
    custDmnStyCSSList={};
    }
    else{
    custDmnStyCssList=item.custDmnStyCssList;
    }

  var videoMngTgl=false; //setting to determine whether or not to monitor all videos that play. on the page.
    if(!item.hasOwnProperty('videoMngTgl')){
    chrome.storage.local.set({videoMngTgl: false});
    }
    else{
    videoMngTgl=item.videoMngTgl;
    }

  var videoStopTgl=false; //setting to determine whether or not to stop all play back.
    if(!item.hasOwnProperty('videoStopTgl')){
    chrome.storage.local.set({videoStopTgl: false});
    }
    else{
    videoStopTgl=item.videoStopTgl;
    }

  var videoStopList={}; //which domains to stop play back on.
    if(!item.hasOwnProperty('videoStopList')){
    chrome.storage.local.set({videoStopList: {}});
    videoStopList={};
    }
    else{
    videoStopList=item.videoStopList;
    }

  var videoStopBList={}; //which domains to ignore stop auto play back on.
    if(!item.hasOwnProperty('videoStopBList')){
    chrome.storage.local.set({videoStopBList: {}});
    videoStopBList={};
    }
    else{
    videoStopBList=item.videoStopBList;
    }



  videoStopEval(videoMngTgl, videoStopTgl, videoStopList, videoStopBList);//checks to see how to evalutate video stoppage


  dmn=window.location.host;
    
    if(item['mnl'] === false || applyList.hasOwnProperty(dmn)===true){

    //if dmn in custList, do nothing
    if(custList.hasOwnProperty(dmn)){
    console.log('butWhyMod: Current URL\'s domain in ignore list. Not removing modals. ' + dmn);
    return null;
    } 

    applyList.hasOwnProperty(dmn)?console.log('butWhyMod: Domain in apply list. Starting removal of modal.'):console.log('butWhyMod: Automatic pruning set. Starting removal of modal.');
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




