import { useEffect } from 'react';

const useURLScript = (url, id) => {
  useEffect(() => {
    const script = document.createElement('script')
    if (url) {
      script.type = 'text/javascript';
      script.src = url
      script.async = true
    }
    if (id) {
      script.id = id
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [url])
}

const useFunctionScript = (body) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.innerHTML = body;

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [body])
}

const addUserSnap = (add) => {
  let tempfunction = ''
  let url = null
  if (add) {
    tempfunction = `window.onUsersnapCXLoad = function(api) {
      api.init({
        button: {isHidden: true}
      });
      window.UsersnapCX = api;
    }`
    url = 'https://widget.usersnap.com/load/2dc74715-843e-4f61-aead-f051733d71d9?onload=onUsersnapCXLoad'
  }
  useFunctionScript(tempfunction)
  useURLScript(url)
}

const addFreshChat = (add) => {
  let tempfunction = ''
  if (add) {
    tempfunction = ` function initFreshChat() {
      window.fcWidget.init({
        token: "86ca9457-cdb6-42d4-b098-a73c88de91b1",
        host: "https://wchat.freshchat.com"
      });
    }
    function initialize(i,t){var e;i.getElementById(t)?initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,e.src="https://wchat.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}
    function initiateCall(){initialize(document,"freshchat-js-sdk")}
    window.initiateCall();`
  }
  useFunctionScript(tempfunction)
}

export { useURLScript, useFunctionScript, addUserSnap, addFreshChat }
