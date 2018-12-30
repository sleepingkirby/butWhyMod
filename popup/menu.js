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

function startListen(){
  document.addEventListener("click", (e) => {
    switch(e.target.name){
      case 'disableMdl':
        //send message to content_scripts
        //const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {action: 'disableMdl'});
        });
      break;
      case 'addToIgnList':
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        var url=tabs[0].url;
        var host=hostFromURL(url);
          browser.storage.local.get('custList').then((custList) => {
          var newCL=custList['custList'];
          newCL[host]=undefined;
            var notif=document.getElementsByClassName('notify')[0];
            notif.id=''; //resets the notification area animation
            browser.storage.local.set({custList: newCL}).then(()=>{
            console.log('butWhyMod: added host to custom List ' + host);
            notif.innerHTML='\'' + host + '\' added to white list.';
            notif.id='fadeOut';
            notif.addEventListener("animationend", ()=>{
            notif.id='';
            });
            }, onError)
          }, onError);
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
         browser.storage.local.set({mnl: !e.target.checked}).then(()=>{console.log('butWhyMod: \'manual\' set to ' + !e.target.checked)}, onError);
      break;
      case 'settings':
        browser.runtime.openOptionsPage().then();
      break;
      default:
      break;
    }
  });

}



  //set the checkbox from the config
  browser.storage.local.get('mnl').then((item) => {
    //set default
    if(!item.hasOwnProperty('mnl')){
    console.log('butWhyMod: manual setting doesn\'t exist. Setting default value.');
    item={mnl: false};
    browser.storage.local.set({mnl: false});                         
    }
    //checked = mnl is false(auto), unchecked = mnl is true(manual)
   document.getElementsByName('mnl')[0].checked = !item['mnl'];
  });


browser.tabs.executeScript({
file: "/content_scripts/butWhyMod.js"
}).then(startListen)
.catch(reportErr);

//alert(document.getElementsByName('auto').length);
//document.getElementsByName('mnl')[0].checked=true;

