/* eslint-disable react/prop-types */
import { Input } from 'antd'
import React from 'react'

export const AnswerstoGroup = (answers, group) => {
  const res = group.map((item, index) => {
    return {
      no: index + 1,
      ans: answers.splice(0, item).map((x) => x),
      // ans: answers.splice(0, item).map((x) => x.isCorrect),   // xem demo
      // ans: answers.splice(0, item).every((x) => x.isCorrect),   // kết quả cuối
    };
  });
  return res;
}
/**
 * 
 * @param {*} answers 
 * @param {*} group 
 * @returns [{ no: 1, ans: true }, { no: 1, ans: false }]
 */

export const AnswerstoGroup_every = (answers, group) => {
  const res = group?.map((item, index) => {
    return {
      no: index + 1,
      ans: answers.splice(0, item).every((x) => x.isCorrect),   // kết quả cuối
    };
  });
  return res;
}

function GroupAnswers({ data, getarrayGroup }) {
  const [state, setstate] = React.useState({
    arrayGroup: null,
    text: '',
  })
  //
  React.useEffect(() => {
    if (data) {
      const text = data.join(' ');
      const arrayGroup = data;
      setstate(pre => ({ ...pre, text, arrayGroup }));
    }
  }, [data])
  //
  const handleChangeValue = (e) => {
    const text = e.target.value.replace(/[\D]/g, ' '); // chỉ nhập số, các ký tự khác thánh dấu cách
    const arrayGroup = text === '' ? null : text.trim().split(/\s+/);
    if (arrayGroup?.toString() !== state.arrayGroup?.toString()) {
      getarrayGroup(arrayGroup); // output
    }
    setstate(pre => ({ ...pre, text, arrayGroup }))
  }
  //
  const showNote = (arr) => {
    if (!arr) return null;
    return (
      <div className="my-2 p-2" style={{ border: '1px dotted black', background: 'white' }}>
        {
          arr.map((item, index) => {
            return (
              <span style={{ display: 'inline-block', color: index % 2 === 0 ? 'green' : '#016394' }} className="mx-2" key={index}>Câu {index + 1}: {item} đáp án</span>
            )
          })
        }
      </div>
    )
  }
  //
  return (
    <div className="mb-3">
      <Input value={state.text} onChange={handleChangeValue} placeholder='số đáp án mỗi câu' />
      {showNote(state.arrayGroup)}
    </div>
  )
}

export default GroupAnswers



