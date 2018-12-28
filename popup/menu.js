/*
function notify(str){
console.log(str);
alert(str);
}
*/

function reportErr(error){
console.error('butWhyMdl: Failed to insert content script into tab/page: ' + error.message);
}

function onError(item){
console.log("Error: " + error);
}

function doNothing(item, err){

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
         browser.storage.local.set({mnl: e.target.checked}).then(()=>{console.log('butWhyMdl: \'manul\' set to ' + e.target.checked)}, onError);
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
  document.getElementsByName('mnl')[0].checked=item['mnl'];
  });


browser.tabs.executeScript({
file: "/content_scripts/butWhyMdl.js"
}).then(startListen)
.catch(reportErr);

//alert(document.getElementsByName('auto').length);
//document.getElementsByName('mnl')[0].checked=true;

