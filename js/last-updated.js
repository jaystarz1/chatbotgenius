(function(){
  var el = document.getElementById('last-updated');
  if (!el) return;
  var d = new Date(document.lastModified);
  var formatted = d.toLocaleDateString('en-CA',{year:'numeric',month:'long',day:'numeric'});
  el.textContent = 'Last updated: ' + formatted;
})();

