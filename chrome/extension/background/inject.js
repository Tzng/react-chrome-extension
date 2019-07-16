/**
 * 判断是否已经注入了
 * @param tabId
 * @return {*}
 */
function isInjected(tabId) {
  console.log('检查脚本是否注入');
  return chrome.tabs.executeScriptAsync(tabId, {
    code: `var injected = window.reactExampleInjected;
      window.reactExampleInjected = true;
      injected;`,
    runAt: 'document_start'
  });
}

/**
 * 加载脚本
 * @param name 脚本名称
 * @param tabId 要注入的标签
 * @param cb 注入成功后的回调函数
 */
function loadScript(name, tabId, cb) {
  // 如果是生成模式，就直接注入
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript(tabId, { file: `/js/${name}.bundle.js`, runAt: 'document_end' }, cb);
  } else {
    // dev: async fetch bundle
    fetch(`http://localhost:3000/js/${name}.bundle.js`)
      .then(res => res.text())
      .then((fetchRes) => {
      // Load redux-devtools-extension inject bundle,
      // because inject script and page is in a different context
        const request = new XMLHttpRequest();
        request.open('GET', 'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js'); // sync
        request.send();
        request.onload = () => {
          if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            chrome.tabs.executeScript(tabId, { code: request.responseText, runAt: 'document_start' });
          }
        };
        chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb);
      });
  }
}

// 定义需要注入的url地址
const arrowURLs = ['^https://baidu\\.com'];

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // 检查url是否匹配
  if (changeInfo.status !== 'loading' || !tab.url.match(arrowURLs.join('|'))) return;

  const result = await isInjected(tabId);
  if (chrome.runtime.lastError || result[0]) return;

  loadScript('entInfo', tabId, () => console.log('load inject bundle success!'));
});

chrome.tabs.onCreated.addListener(async (tab) => {
  loadScript('entInfo', tab.id, () => console.log('load inject bundle success!'));
});

chrome.windows.getCurrent((currentWindow) => {
  // 获取有指定属性的标签，为空获取全部标签
  chrome.tabs.query({
    active: true, windowId: currentWindow.id
  }, (activeTabs) => {
    // 获取所有打开的标签
    console.log('tabs：', activeTabs);
    // 循环获取百度的tabs
    activeTabs.forEach((item) => {
      if (item.url.indexOf('www.baidu.com') > 0) {
        console.log('TabId:' + item.id);
        // 执行注入，第一个参数表示向哪个标签注入
        // 第二个参数是一个option对象，file表示要注入的文件，也可以是code
        // 是code时，对应的值为要执行的js脚本内容，如：code: "alert(1);"
        // allFrames表示如果页面中有iframe，是否也向iframe中注入脚本
        // chrome.tabs.executeScript(item.id, { file: './baidu.js', allFrames: false });
      }
    });
  });
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener((tabs) => {
  console.log('chrome.browserAction.onClicked');
  tabs.executeScript({
    // 设置活动状态的tab显示的页面的document对象的属性
    code: 'document.body.style.backgroundColor="red"'// 通过JS代码
  });
  loadScript('entInfo', tab.id, () => console.log('load inject bundle success!'));
});
