/*
function notify(str){
console.log(str);
alert(str);
}
*/

function reportErr(error){
console.error('butWhyMod: Failed to insert content script into tab/page: ' + error.message);
}

function onError(item){
console.log("Error: " + error);
var notif=document.getElementsByClassName('notify')[0];

}

function doNothing(item, err){
}

//gets hostname from url
function hostFromURL(str){
var rtrn=str;
var proto=rtrn.match(/[a-z]+:\/\/+/g);
var rtrn=rtrn.substr(proto[0].length,rtrn.length);
var end=rtrn.search('/');
var rtrn=rtrn.substr(0,end);
return rtrn;
}

/*--------------------------------------
pre: hostFromUrl()
post: whatever cbFunc does
gets the host from the url of the current active tab
params:
lst=ignore list
cbFunc() Call back function
cbFuncPrms=should be an object
---------------------------------------*/
function getCurHost( cbFunc, cbFuncPrms ){
  chrome.tabs.query({active: true, currentWindow: true},(tabs) => {
  var url=tabs[0].url;
  var host=hostFromURL(url);

  cbFuncPrms["host"]=host;
  cbFunc(cbFuncPrms);
  });
}

/*----------------------------------------
pre: getCurHost()
post: html of popup changed
this function is meant to run in getCurHost() (although it can be ran outside of it.
to set the checkbox of obj.cn (by classname)
----------------------------------------*/
function chckChckBox(obj){
document.getElementsByName(obj.cn)[0].checked = obj.list.hasOwnProperty(obj.host)?true:false;
}

/*----------------------------------------
pre: getCurHost()
post: html of popup changed
this function is meant to run in getCurHost() (although it can be ran outside of it.
to set the checkbox of obj.cn (by classname)
----------------------------------------*/
function tglDmnInList(obj){
  chrome.storage.local.get(obj.i,(d)=>{
    if(d[obj.i].hasOwnProperty(obj.host)){
    delete d[obj.i][obj.host];
    }
    else{
    d[obj.i][obj.host]=null;
    }
  let o={};
  o[obj.i]=d[obj.i];
    chrome.storage.local.set(o,(e)=>{
      console.log('butWhyMod: \''+obj.i+'\' has been updated for domain \''+obj.host+'\'.');
    });
  });
}

function startListen(){
  document.addEventListener("click", (e) => {
    switch(e.target.name){
      case 'disableMdl':
        //send message to content_scripts
        //const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'disableMdl'});
        });
      break;
      case 'addToIgnList':
        chrome.tabs.query({active: true, currentWindow: true},(tabs) => {
        var url=tabs[0].url;
        var host=hostFromURL(url);
          chrome.storage.local.get('custList',(custList) => {
          var newCL=custList.custList;
          newCL[host]=null;
            var notif=document.getElementsByClassName('notify')[0];
            notif.id=''; //resets the notification area animation
            chrome.storage.local.set({custList: newCL},()=>{
            console.log('butWhyMod: added host to custom List ' + host);
            notif.textContent='\'' + host + '\' added to white list.';
            notif.id='fadeOut';
            notif.addEventListener("animationend", ()=>{
            notif.id='';
            });
            })
          });
        });
        //browser.storage.local.set({mnl: !e.target.checked}).then(()=>{console.log('butWhyMod: \'manual\' set to ' + !e.target.checked)}, onError);
      break;
      case 'addToApplyList':
        chrome.tabs.query({active: true, currentWindow: true},(tabs) => {
        var url=tabs[0].url;
        var host=hostFromURL(url);
          chrome.storage.local.get('custApplyList',(d) => {
          var newCL=d.custApplyList;
          newCL[host]=null;
            var notif=document.getElementsByClassName('notify')[0];
            notif.id=''; //resets the notification area animation
            chrome.storage.local.set({custApplyList: newCL},()=>{
            console.log('butWhyMod: added host to Apply List ' + host);
            notif.textContent='\'' + host + '\' added to Apply list.';
            notif.id='fadeOut';
            notif.addEventListener("animationend", ()=>{
            notif.id='';
            });
            })
          });
        });
        //browser.storage.local.set({mnl: !e.target.checked}).then(()=>{console.log('butWhyMod: \'manual\' set to ' + !e.target.checked)}, onError);
      break;
      case 'mnl':
      /*
        browser.storage.local.get('mnl').then((item) => {
          if(item.hasOwnProperty('mnl')){
            console.debug(e.target.checked);
            console.debug(item['mnl']);
          }
          else{
            console.log('item is undefined');
            browser.storage.local.set({mnl: e.target.checked});
          }
        }
        , onError);
      */
        chrome.storage.local.set({mnl: !e.target.checked},()=>{console.log('butWhyMod: \'manual\' set to ' + !e.target.checked)});
      break;
      case 'videoMngTgl':
        chrome.storage.local.set({videoMngTgl: e.target.checked},()=>{console.log('butWhyMod: \'videoMngTgl\' set to ' + e.target.checked)});
      break;
      case 'videoStopTgl':
        chrome.storage.local.set({videoStopTgl: e.target.checked},()=>{console.log('butWhyMod: \'videoStopTgl\' set to ' + e.target.checked)});
      break;
      case 'videoStopList':
        getCurHost(tglDmnInList,{i:'videoStopList'});     
      break;
      case 'videoStopBList':
        getCurHost(tglDmnInList,{i:'videoStopBList'});     
      break;
      case 'settings':
        chrome.runtime.openOptionsPage();
      break;
      case 'donate':
        chrome.tabs.create({url: 'https://b3spage.sourceforge.io/?butWhyMod'});
      break;
      default:
      break;
    }
  });

}



  //set the checkbox from the config
  chrome.storage.local.get(null,(item) => {
    //set default
    if(!item.hasOwnProperty('mnl')){
    console.log('butWhyMod: manual setting doesn\'t exist. Setting default value.');
    item={mnl: false};
    chrome.storage.local.set({mnl: false});                         
    }
    //checked = mnl is false(auto), unchecked = mnl is true(manual)
  document.getElementsByName('mnl')[0].checked = !item['mnl'];

    if(!item.hasOwnProperty('videoMngTgl')){
    console.log('butWhyMod: videoMngTgl setting doesn\'t exist. Setting default value.');
    item={videoMngTgl: false};
    chrome.storage.local.set({videoMngTgl: false});
    }
  document.getElementsByName('videoMngTgl')[0].checked = item['videoMngTgl'];


    if(!item.hasOwnProperty('videoStopTgl')){
    console.log('butWhyMod: videoStopTgl setting doesn\'t exist. Setting default value.');
    item={videoStopTgl: false};
    chrome.storage.local.set({videoStopTgl: false});
    }
  document.getElementsByName('videoStopTgl')[0].checked = item['videoStopTgl'];


    if(!item.hasOwnProperty('videoStopList')){
    console.log('butWhyMod: videoStopList setting doesn\'t exist. Setting default value.');
    item={videoStopList: false};
    chrome.storage.local.set({videoStopList: {}});
    }
  //getting the current active tab's hostname is a recursive function so using a callback here to set the html element
  getCurHost(chckChckBox,{cn:'videoStopList', list:item.videoStopList});

    if(!item.hasOwnProperty('videoStopBList')){
    console.log('butWhyMod: videoStopBList setting doesn\'t exist. Setting default value.');
    item={videoStopBList: false};
    chrome.storage.local.set({videoStopBList: {}});
    }
  //getting the current active tab's hostname is a recursive function so using a callback here to set the html element
  getCurHost(chckChckBox,{cn:'videoStopBList', list:item.videoStopBList});

  });


chrome.tabs.executeScript({
file: "/content_scripts/butWhyMod.js"
}, startListen);

//alert(document.getElementsByName('auto').length);
//document.getElementsByName('mnl')[0].checked=true;

