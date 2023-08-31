export function* postResetPassApi(phone) {
  let request = {
    uri: 'https://cloud.softech.cloud/mobile/ames/api/myames/ResetPassword',
    configs: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'AppName': 'WEB_MY_AMES',
      },
      body: JSON.stringify({
        username: phone,
      })
    }
  };
  let response = yield fetch(request.uri, request.configs).then(j => j.json()).then(v => {
    return v;
  });
  return response;
}


