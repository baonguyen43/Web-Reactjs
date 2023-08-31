import { postAnswerToAPI } from 'components/functions';
import { query } from 'helpers/QueryHelper';

export const saveAnswerToServer = async ({ user, sessionId, assignmentId, score, takeExamTime, data, duration }) => {
  const answerModel = {
    studentId: user.StudentId,
    sessionId,
    assignmentId,
    questionEntityName: '',
    groupName: '',
    questionId: 0,
    questionGuid: '',
    answerType: 'LIVEWORKSHEET',
    notes: '',
    score,
    takeExamTime: takeExamTime,
    studentChoice: data,
    duration,
  };
  return await postAnswerToAPI(answerModel).then(() => 'OK').catch(() => 'ERROR')
}

export const fetcher = async ({ sessionId, attachmentId, assignmentId, takeExamTime, userId, asrId }) => {
  if (!attachmentId) return [];
  const parameters = {
    sessionId,
    assignmentId,
    attachmentId,
    takeExamTime,
    userId,
    ASR_Id: asrId,
    device: 'WEB',
  }
  return query('[dbo].p_MYAMES_Session_Assignment_GetQuestionType_LIVEWORKSHEET_WithLog', parameters)
};