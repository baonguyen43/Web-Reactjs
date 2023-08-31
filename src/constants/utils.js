import { API_MYAMES } from 'configs/api';

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return 'mobile';
  }
  return 'desktop';
};

const customEvent = {};

const addEventListener = (eventName, listenerId, listener) => {
  const listenerModel = { listenerId, listener };

  if (customEvent[eventName] instanceof Array) {
    customEvent[eventName].push(listenerModel);
  } else {
    customEvent[eventName] = [listenerModel]
  }
};

const removeEventListener = (eventName, listenerId) => {
  if (customEvent[eventName] instanceof Array) {
    const index = customEvent[eventName].findIndex((e) => e.listenerId === listenerId);
    if (index > -1) {
      customEvent[eventName].splice(index, 1);
    }
  }
};

const triggerEvent = (eventName, data) => {
  if (customEvent[eventName] instanceof Array) {
    customEvent[eventName].forEach((item) => {
      if (typeof item.listener === 'function') {
        item.listener(data);
      }
    });
  }
}

const getGiftCodeStudent = async (userId, userCode) => {
  let giftcode = [];
  try {
    const request = {
      uri: `${API_MYAMES}//Get`,
      configs: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: `type=giftcode&usercode=${userCode}&userid=${userId}`,
      },
    };

    const response = await fetch(request.uri, request.configs);

    const json = await response.json();

    if (json.status === 'success') {
      giftcode = json.data;
    }
  } catch (error) {
    //
  }
  return giftcode;
};

const utils = {
  getGiftCodeStudent,
  getDeviceType,
  triggerEvent,
  addEventListener,
  removeEventListener,
}

export default utils;
