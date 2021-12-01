// Adds optional word break points into long URLs that appear in the text
(function() {
  // Get all links except those that are inside .quire-nav-button which include 
  // SVG icons and will erronesously match the if statement below, as well as 
  // any links/text explicitly marked as a .url-string, such as in the 
  // Cite This Page partial
  const links = document.querySelectorAll('*:not(.quire-nav-button) > a, .url-string')
  
  Array.prototype.forEach.call(links, link => {
    
    // Check if text inside the link includes "http" and so is a URL.
    // The limitation of this method is that if there is more than just text 
    // inside the link, like other html elements, and they include "http"
    // they'll match. Would be better to limit the innerHTML search to
    // childNodes that have a TEXT_NODE type.
    if(link.innerHTML.indexOf("http") !== -1) {
      
      // For links that are URLs, add word break html elements, <wbr>, in
      // appropriate places, as specified in Chicago Manual of Style 17, 14.18
      // https://www.chicagomanualofstyle.org/book/ed17/part3/ch14/psec018.html
      link.innerHTML = link.innerHTML.replace(/\//g,"<wbr>/")
                                     .replace(/\~/g,"<wbr>~")
                                     .replace(/\./g,"<wbr>.")
                                     .replace(/\,/g,"<wbr>,")
                                     .replace(/\-/g,"<wbr>-")
                                     .replace(/\_/g,"<wbr>_")
                                     .replace(/\?/g,"<wbr>?")
                                     .replace(/\#/g,"<wbr>#")
                                     .replace(/\%/g,"<wbr>%")
                                     .replace(/\=/g,"<wbr>=")
                                     .replace(/\&/g,"<wbr>&")
                                     .replace(/<wbr>\/<wbr>\//g,"//<wbr>")
                                     .replace(/\:/g,":<wbr>");
    }

  })
})()