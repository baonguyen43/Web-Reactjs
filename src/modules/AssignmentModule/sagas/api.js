import { query } from 'helpers/QueryHelper';

export function* getAssignmentsByMix4({ sessionId, studentId }) {
  const result = yield query('p_AMES247_GetQuestions_BySessionId_MIX4', { sessionId, studentId });
  return result;
}
