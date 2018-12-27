

document.addEventListener("click", (e) => {
  switch(e.target.name){
    case 'disableMdl':
      //send message to content_scripts
      alert(e.target.name);
    break;
    case 'auto':
    break;
    default:
    break;
  }
});

//alert(document.getElementsByName('auto').length);
document.getElementsByName('auto')[0].checked=true;

