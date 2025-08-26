// Background script for Chrome extension
// Opens the breathing app in a new tab when extension icon is clicked

chrome.action.onClicked.addListener((tab) => {
  // Open the breathing app in a new tab
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html'),
    active: true
  });
});
