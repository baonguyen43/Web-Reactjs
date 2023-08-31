import { axiosAMES, dynamicApiAxios } from 'configs/api';
import * as functions from 'components/functions';

export function* getQuestionsFromApi({ sessionId, assignmentId, takeExamTime, userId, asrId }) {
  const res = yield axiosAMES.get(`GetQuestionOfSessionV5/${sessionId}/${assignmentId}/${takeExamTime}/${userId}/${asrId}`);
  if (res.status === 200) {
    return res.data;
  }
  return null;
}

export function* getQuestionsTOEIC_LISTENING_READINGFromApi({ sessionId, studentId, takeExamTime, toeicSelectedPart }) {
  const body = new FormData();
  body.append('sessionId', sessionId);
  body.append('studentId', studentId);
  body.append('takeExamTime', takeExamTime);
  body.append('part', toeicSelectedPart.part);
  const response = yield axiosAMES.post('/GetToeicOnlineQuestions', body);
  if (response.data.questions instanceof Array) {
    return response.data;
  }
}

export function* getQuestionsType35FromApi({ sessionId, userId, type }) {
  const sqlCommand = type === 'IELTS_EXPLORER' ? 'p_AMES247_TypeIeltsExplorer_GetQuestions' : 'p_AMES247_TypeSpeak_GetQuestions';
  const parameters = {
    SessionId: sessionId,
    StudentId: userId,
  };

  const body = {
    sqlCommand,
    parameters,
  };

  const response = yield dynamicApiAxios.query.post('', body);
  if (response.status === 200) {
    return response.data;
  }
  return {};
}


export function* getQuestionsMix_FromApi({ sessionId, userId, takeExamTime }) {

  const body = {
    sqlCommand: '[dbo].[p_AMES247_GetQuestions_BySessionId]',
    parameters: {
      SessionId: sessionId,
      StudentId: userId,
      TakeExamTime: takeExamTime
    }
  }

  const questions = yield dynamicApiAxios.query.post('', body).then((response) => {
    return response
  }).catch(err => {
    console.log(err);
    //Alert.alert('Lỗi', 'Lỗi kết nối, vui lòng thử lại sau.');
  });

  return questions
}

export function* postMediaAnswerToApi(body) {
  let __response = null;
  let reader = new FileReader();
  reader.readAsDataURL(body.blobFile);
  reader.onload = yield function () {
    const DATA = new FormData();

    DATA.append('input', reader.result);
    DATA.append('extensionInput', 'wav');
    DATA.append('readingText', 'cloud');
    DATA.append('studentID', '11147806');
    DATA.append('takeExamTime', functions.uuid());

    try {
      let response = fetch(
        'https://ames.edu.vn/ames/api/amesapi/SaveFileAndCalculateScore',
        {
          body: DATA,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST'
        }
      );

      __response = response;
    } catch (error) {
      console.log('response error', error);
    }
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };

  return __response;
}
