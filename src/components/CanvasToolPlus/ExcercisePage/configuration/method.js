import { modeName } from '.';
import _ from 'lodash';

const { WRITE, CHOICE, MATCH, SELECTWORD, LISTEN, DRAGDROP, DROPDOWN } = modeName;
export function modeFilter(data) {
  if (!data) return {};
  // const NO = 'no';
  const YES = 'yes';
  const list = _.groupBy(data, (o) => o.mode);
  const groupChoice = Object.values(_.groupBy(list[CHOICE], (x) => x.groupName));
  //
  const oneChoice = groupChoice.filter((item) => _.countBy(item, (o) => o.text)[YES] === 1);
  const multipleChoice = groupChoice.filter((item) => _.countBy(item, (o) => o.text)[YES] > 1);
  //
  return {
    write: list[WRITE],
    match: list[MATCH],
    listen: list[LISTEN],
    oneChoice,
    multipleChoice,
    selectWord: list[SELECTWORD],
    dragdrop: list[DRAGDROP],
    dropDown: list[DROPDOWN],
  };
}
