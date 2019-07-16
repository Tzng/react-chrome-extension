console.log('这是content script!');

// 初始化操作
function initCustomPanel() {
  const panel = document.createElement('div');
  panel.className = 'chrome-plugin-demo-panel';
  panel.innerHTML = `
    <h2>injected-script操作content-script演示区：</h2>
    <div class="btn-area">
    <a href="javascript:sendMessageToContentScriptByPostMessage('你好，我是普通页面！')">通过postMessage发送消息给content-script</a><br>
    <a href="javascript:sendMessageToContentScriptByEvent('你好啊！我是通过DOM事件发送的消息！')">通过DOM事件发送消息给content-script</a><br>
    <a href="javascript:invokeContentScript('sendMessageToBackground()')">发送消息到后台或者popup</a><br></div><div id="my_custom_log">
    </div>`;
  document.body.appendChild(panel);
}

// 向页面注入JS
function injectCustomJs(jsPath) {
  jsPath = jsPath || 'js/inject.js';
  const temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  if (typeof process === 'undefined') {
    // 说明是开发模式
    temp.src = 'http://localhost:3000/' + jsPath;
    console.log('注入的js为', 'http://localhost:3000/' + jsPath);
  } else {
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
  }
  temp.onload = function () {
    // 放在页面不好看，执行完后移除掉
    this.parentNode.removeChild(this);
  };
  document.body.appendChild(temp);
}

// 接收来自后台的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到来自 ' + (sender.tab ? 'content-script(' + sender.tab.url + ')' : 'popup或者background') + ' 的消息：', request);
  if (request.cmd == 'update_font_size') {
    const ele = document.createElement('style');
    ele.innerHTML = `* {font-size: ${request.size}px !important;}`;
    document.head.appendChild(ele);
  } else {
    tip(JSON.stringify(request));
    sendResponse('我收到你的消息了：' + JSON.stringify(request));
  }
});

// 主动发送消息给后台
// 要演示此功能，请打开控制台主动执行sendMessageToBackground()
function sendMessageToBackground(message) {
  chrome.runtime.sendMessage({ greeting: message || '你好，我是content-script呀，我主动发消息给后台！' }, (response) => {
    tip('收到来自后台的回复：' + response);
  });
}

// 监听长连接
chrome.runtime.onConnect.addListener((port) => {
  console.log(port);
  if (port.name == 'test-connect') {
    port.onMessage.addListener((msg) => {
      console.log('收到长连接消息：', msg);
      tip('收到长连接消息：' + JSON.stringify(msg));
      if (msg.question == '你是谁啊？') port.postMessage({ answer: '我是你爸！' });
    });
  }
});

window.addEventListener('message', (e) => {
  console.log('收到消息：', e.data);
  if (e.data && e.data.cmd == 'invoke') {
    eval('(' + e.data.code + ')');
  } else if (e.data && e.data.cmd == 'message') {
    tip(e.data.data);
  }
}, false);


function initCustomEventListen() {
  let hiddenDiv = document.getElementById('myCustomEventDiv');
  if (!hiddenDiv) {
    hiddenDiv = document.createElement('div');
    hiddenDiv.style.display = 'none';
    hiddenDiv.id = 'myCustomEventDiv';
    document.body.appendChild(hiddenDiv);
  }
  hiddenDiv.addEventListener('myCustomEvent', () => {
    const eventData = document.getElementById('myCustomEventDiv').innerText;
    tip('收到自定义事件：' + eventData);
  });
}

let tipCount = 0;
// 简单的消息通知
function tip(info) {
  info = info || '';
  const ele = document.createElement('div');
  ele.className = 'chrome-plugin-simple-tip slideInLeft';
  ele.style.top = tipCount * 70 + 20 + 'px';
  ele.innerHTML = `<div>${info}</div>`;
  document.body.appendChild(ele);
  ele.classList.add('animated');
  tipCount++;
  setTimeout(() => {
    ele.style.top = '-100px';
    setTimeout(() => {
      ele.remove();
      tipCount--;
    }, 400);
  }, 3000);
}

// 执行注入程序
injectCustomJs();
// 初始操作台
initCustomPanel();
