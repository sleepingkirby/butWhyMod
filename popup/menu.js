/*
function notify(str){
console.log(str);
alert(str);
}
*/

function reportErr(error){
console.error('Failed to execute beastify content script: ' + error.message);
}

function startListen(){
  document.addEventListener("click", (e) => {
    switch(e.target.name){
      case 'disableMdl':
        //send message to content_scripts
        alert(e.target.name);
      break;
      case 'mnl':
	browser.runtime.sendMessage({action: "message from the content script"});
      break;
      case 'settings':
        browser.runtime.openOptionsPage().then();
      break;
      default:
      break;
    }
  });
}

startListen();

//alert(document.getElementsByName('auto').length);
//document.getElementsByName('mnl')[0].checked=true;

