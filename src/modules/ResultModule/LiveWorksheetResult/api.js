import { query } from 'helpers/QueryHelper';

export const getResultOfPlayedTime = async (parameters) => {
  return await query('dbo.p_AMES247_GetResultOfPlayedTime_LIVEWORKSHEET', parameters);
}