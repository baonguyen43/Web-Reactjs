/* eslint-disable no-unused-expressions */
import React from 'react';
// import styles from './styles.module.css';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import FooterIeltsMindset from '../../FooterModal';
import wordsearch from 'wordsearch-generator'
import styles from './styles.module.css'

const keyword = ['ant', 'monkey', 'cat', 'dog', 'baldeagle']

const WordsFind = ({ question }) => {
  const [state, setState] = React.useState({
    sentences: JSON.parse(JSON.stringify(question)),
    isDisabledInput: false,
    // isDisabledSubmit:false,
    isDisabledRetry: true,
    videoVisible: false,
    lines: [],
    wordArray: [],
  });

  // Tạo mảng ô chữ
  React.useEffect(() => {
    let puzzleGrid = wordsearch.createPuzzle(10, 10, 'en', keyword)
    puzzleGrid = wordsearch.hideWords(puzzleGrid, 'en')
    const lines = wordsearch.printGrid(puzzleGrid)
    let wordArray = []
    lines.forEach((item, index) => {
      const word = item.split(' ')
      wordArray.push(word)
    })
    setState((prevState) => ({ ...prevState, lines, wordArray }))
  }, [])

  const onSubmit = React.useCallback(() => {

  }, [])

  const onRetry = React.useCallback(() => {

    setState((preState) => ({ ...preState, isDisabledInput: false, isDisabledRetry: true }))
  }, [])

  // Khi hoàn thành các field
  // const onFinish = React.useCallback((value) => {

  // }, [])

  const findWord = React.useCallback(() => {

    const selection = getSelection();

    //Điểm bôi đầu tiên
    const startPoint = selection.anchorNode.parentElement.getAttribute('id');
    let rowStartIndex = parseInt(startPoint?.split('-')[0]);

    let startIndex = parseInt(startPoint?.split('-')[1]);

    //Điểm bôi cuối
    const endPoint = selection.focusNode.parentElement.getAttribute('id');

    let rowEndIndex = parseInt(endPoint?.split('-')[0]);

    let endIndex = parseInt(endPoint?.split('-')[1]);

    let stringSelected = null;
    let arraySelected = [];


    if (rowStartIndex === rowEndIndex) {
      // kiểm tra có cùng hàng hay không
      if (startIndex > endIndex) {
        [startIndex, endIndex] = [endIndex, startIndex];
      }
      stringSelected = state.wordArray[rowStartIndex].slice(startIndex, endIndex + 1).join('').toLowerCase()
      for (let i = startIndex; i <= endIndex; i++) {
        const id = `${rowStartIndex}-${i}`;
        arraySelected.push(id)
      }
    } else {
      // Kiểm tra có cùng cột hay không
      if (startIndex === endIndex) {

        if (rowStartIndex > rowEndIndex) {
          [rowStartIndex, rowEndIndex] = [rowEndIndex, rowStartIndex];
        }
        let arrayCharactor = []
        for (let i = rowStartIndex; i <= rowEndIndex; i++) {
          const id = `${i}-${startIndex}`;
          arraySelected.push(id)
          arrayCharactor.push(state.wordArray[i][startIndex])
        }
        stringSelected = arrayCharactor.join('').toLowerCase()

      } else {
        //kiểm tra đường chéo
        const rangeRow = rowEndIndex - rowStartIndex
        if (rangeRow > 0) {
          //Kiểm tra chéo từ trên xuống 
          const isStartLeft = startIndex < endIndex
          const isDiagonalLine = isStartLeft ? startIndex + rangeRow === endIndex : startIndex - rangeRow === endIndex

          if (isDiagonalLine) {
            let arrayCharactor = [];
            let currentIndex = startIndex
            for (let i = rowStartIndex; i <= rowEndIndex; i++) {
              const id = `${i}-${currentIndex}`;
              arraySelected.push(id)
              arrayCharactor.push(state.wordArray[i][currentIndex])
              isStartLeft ? currentIndex++ : currentIndex--
            }
            stringSelected = arrayCharactor.join('').toLowerCase()
          }
        } else {
          //Kiểm tra chéo từ dưới lên
          [startIndex, endIndex] = [endIndex, startIndex];
          [rowStartIndex, rowEndIndex] = [rowEndIndex, rowStartIndex];
          const isStartLeft = startIndex < endIndex
          const isDiagonalLine = isStartLeft ? startIndex - rangeRow === endIndex : startIndex + rangeRow === endIndex

          if (isDiagonalLine) {
            let arrayCharactor = [];
            let currentIndex = startIndex
            for (let i = rowStartIndex; i <= rowEndIndex; i++) {
              const id = `${i}-${currentIndex}`;
              arraySelected.push(id)
              arrayCharactor.push(state.wordArray[i][currentIndex])
              isStartLeft ? currentIndex++ : currentIndex--
            }
            stringSelected = arrayCharactor.join('').toLowerCase()
          }
        }
      }
    }

    const isCorrect = keyword.includes(stringSelected) || keyword.includes(stringSelected?.split('').reverse().join(''))

    return { isCorrect, stringSelected, arraySelected }
  }, [state.wordArray])

  const onMouseUp = React.useCallback(() => {
    const { isCorrect, arraySelected } = findWord();
    // console.log("🚀 ~ file: index.js ~ line 114 ~ onMouseUp ~ isCorrect", isCorrect)
    // console.log("🚀 ~ file: index.js ~ line 114 ~ onMouseUp ~ stringSelected", stringSelected)
    // console.log("🚀 ~ file: index.js ~ line 114 ~ onMouseUp ~ arraySelected", arraySelected)
    if (isCorrect) {
      arraySelected.forEach((item, index) => {
        document.getElementById(item).style.color = 'white';
        document.getElementById(item).style.backgroundColor = '#27ae60'
      })
    }

  }, [findWord])

  const onMouseDown = React.useCallback(async () => {
    // await new Promise((resolve) => setTimeout(resolve, 100));
    // const results =  findWord()
    // console.log("🚀 ~ file: index.js ~ line 113 ~ onMouseDown ~ results", results)

  }, [])

  const renderWord = React.useCallback((word, rowIndex) => {
    return (
      <div key={rowIndex} onMouseMove={onMouseDown} onMouseUp={onMouseUp} className={styles.contanerWordList}>
        {word.map((itemWord, index) => {
          return <span key={index} id={`${rowIndex}-${index}`} className={styles.itemWord}>{itemWord}</span>
        })}
      </div>
    )
  }, [onMouseDown, onMouseUp])

  const renderWordSearch = React.useMemo(() => {
    return state.lines.map((item, index) => {
      const word = item.split(' ');
      return renderWord(word, index)
    })
  }, [renderWord, state.lines])

  if (!state.lines) return null;

  return (
    <>
      <Row className='d-flex justify-content-center'>
        <Col className='d-initial justify-content-center'>
          {renderWordSearch}
        </Col>
      </Row>
      <Row className='mt-4'>
        <FooterIeltsMindset
          isDisabledSubmit={state.isDisabledInput}
          isDisabledRetry={state.isDisabledRetry}
          onSubmit={onSubmit}
          onRetry={onRetry}
        // onPlayVideo={onPlayVideo}
        />
      </Row>
    </>
  );
};
WordsFind.propTypes = {
  // allowPress: PropTypes.func.isRequired,
  question: PropTypes.instanceOf(Object),

}
export default WordsFind;
