/* eslint-disable react/prop-types */
import React from 'react'

import styles from './styles.module.css'
// import { primaryHex } from 'configs/color'
import PropTypes from 'prop-types';


const TitleQuestion = ({ title, no, type, imgUrl, subtitle, subExercise }) => {
  const [splitArray, setSplitArray] = React.useState([])
  React.useEffect(() => {
    const splitNum = () => {
      if (!no) return null;
      let splitArray = no.split('')
      if (splitArray.length === 1) {
        splitArray.splice(0, 0, '0')
      }
      // console.log("🚀 ~ file: index.js ~ line 14 ~ splitNum ~ splitArray", splitArray)
      setSplitArray(splitArray)
    }
    splitNum()
  }, [no])
  return (
    <div className='w-100 mt-2 mb-2'>
      {/* <div><span className={styles.spanTitle}>{type}</span></div> */}
      <div style={{ flexDirection: 'row', display: 'flex', paddingTop: 10, alignItems: 'center' }}>
        <div style={{ borderColor: '#022F63', fontSize: 20, fontWeight: '700', minWidth: 70 }}>
          {splitArray && splitArray.map((item, index) => (
            <span key={index} className={styles.spanNumberQuestion}>{item}</span>
          ))}
          <span style={{
            color: 'white',
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderStyle: 'solid',
            borderColor: '#022F63',
            backgroundColor: '#022F63',
          }}><i className="fas fa-play" style={{ fontSize: 12, verticalAlign: 'middle' }}></i></span>
        </div>
        <div><span style={{ fontSize: 18, fontWeight: '500', color: 'black' }}>{title}</span></div>
      </div>
      {subtitle &&
        <div style={{ flexDirection: 'row', display: 'flex', paddingTop: 20, alignItems: 'center' }}>
          <div><span className='text-primary' style={{ fontSize: 18, fontWeight: '500' }}>{subExercise}. {subtitle}</span></div>
        </div>}
      {imgUrl ? (
        <div><img alt='...' src={imgUrl} /></div>
      ) : (<></>)}
    </div>
  )
}

TitleQuestion.propTypes = {
  title: PropTypes.string,
  no: PropTypes.string,
  type: PropTypes.string,
  imgUrl: PropTypes.string,
}
export default TitleQuestion
