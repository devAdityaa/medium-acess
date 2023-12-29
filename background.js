let id = 1
let ids = []
chrome.runtime.onInstalled.addListener(function() {
    // Create a context menu item
    chrome.contextMenus.create({
      id: "myContextMenuOption",
      title: "Break this Article!",
      contexts: ["all"],
    });
  });


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo,tab)=>{
    console.log(tab.url.includes('webcache.googleusercontent'))
    if(!(tab.url.includes('webcache.googleusercontent'))){
      console.log("fired")
      let rules = await chrome.declarativeNetRequest.getDynamicRules();
      let rulesarr = []
      for(let i of rules){
        console.log(i)
        rulesarr.push(i.id)
      }
      console.log(rules)
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds : rulesarr
      })
      
      
    }
    
  })


  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "myContextMenuOption") {
      // Check if the context is within medium.com
      
      let url = "http://webcache.googleusercontent.com/search?q=cache:"+tab.url
        chrome.tabs.update({url:url})
        id = id+Math.floor(Math.random() * 1000)
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id: id,
            priority: 1,
            action: { type: "block" },
            condition: {
              urlFilter: "https://cdn-client.medium.com/lite/static/js/main*",
            }
          }
        ]
      })
      ids.push(id)
       
    }
  });  

  
  // chrome.contextMenus.onClicked.addListener(function(info, tab) {
  //   if (info.menuItemId === "myContextMenuOption") {
  //     // Check if the context is within medium.com
  //     let url = "http://webcache.googleusercontent.com/search?q=cache:"+tab.url
  //     fetch(url)
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`Network response was not ok: ${response.status}`);
  //   }
  //   return response.text();
  // })
  // .then(html => {
  //   chrome.tabs.sendMessage(tab.id,{break:"ok",html:html})
  // })
  // .catch(error => {
  //   console.error('There was a problem with the fetch operation:', error);
  // });
        
     
  //   }
  // });  