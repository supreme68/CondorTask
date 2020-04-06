'use strict';

function loadHTMLFiles(pathToFiles, htmlIDs) {
    pathToFiles.forEach((path, i)=>{
    var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById(htmlIDs[i]).innerHTML = this.responseText.replace(/""/g, "'");        
        }
      };
      xhttp.open("GET", path, true);
      xhttp.send();
    })
  }