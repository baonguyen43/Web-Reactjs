import { query } from 'helpers/QueryHelper';
import { SumStringToArray } from './Result';

const typesResult = {
  writeResult: '',
  oneChoiceResult: '',
  multipleChoiceResult: '',
  matchResult: '',
  selectWordResult: '',
  dropDownResult: '',
  dragDropResult: '',
};

export const saveToServer = async (score, data, studentData) => {
  const { result, resultListen } = data;
  const isEmpty = JSON.stringify(result) === '{}';

  // let totalCompleted = 0;
  // let completed = 0;

  // for (const key in result) {
  // const completeArray = result[key].complete.split('/');
  // completed += +completeArray[0];
  // totalCompleted += +completeArray[1];
  // const k = key === 'dragdropResult' ? 'dragDropResult' : key;
  // typesResult[k] = result[key].resultString;
  // }

  Object.assign(typesResult, result);

  const resultData = isEmpty ? resultListen : result;
  //
  const resultArray = SumStringToArray(resultData, 'resultString');
  const [completed, totalCompleted] = SumStringToArray(resultData, 'complete');
  //
  const newScore = isEmpty ? (completed * 10) / totalCompleted : score;

  const parameters = {
    ...studentData,
    type: 'LIVEWORKSHEET',
    score: Math.round(newScore * 10),
    star: Math.floor(newScore * 10),
    completedPercent: Math.round((completed / totalCompleted) * 100),
    jsonData: JSON.stringify(data),
    TeacherNotes: '',
    Notes: '',
    TotalQuestion: totalCompleted,
    TotalAnswer: completed,
    PassedQuestion: resultArray[0],
    ...typesResult,
  };

  return query('[dbo].[p_MYAMES_CLASSWORK_Assignments_Answer_InsertUpdate]', parameters)
    .then((rs) => {
      return {
        info: 'ok',
        payload: {
          data: JSON.stringify(data),
          score: Math.round(score * 10),
        },
      };
    })
    .catch(() => {
      return {
        info: 'error',
      };
    });
};
