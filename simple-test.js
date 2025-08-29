console.log('External script loaded successfully');

// Simple test widget
document.addEventListener('DOMContentLoaded', function() {
  var widget = document.createElement('div');
  widget.style.cssText = 'background:red;color:white;padding:20px;margin:20px;border:3px solid yellow;font-size:18px;position:relative;z-index:9999;';
  widget.innerHTML = '<h2>EXTERNAL SCRIPT TEST</h2><p>This proves external loading works!</p>';
  
  var target = document.querySelector('main') || document.body;
  target.appendChild(widget);
  
  console.log('Test widget inserted');
});