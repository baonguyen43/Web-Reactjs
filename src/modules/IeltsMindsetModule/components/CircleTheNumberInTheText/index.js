import React from 'react'
import PropTypes from 'prop-types'
import ReactHtmlParser from 'react-html-parser';

const circleStyle = {
    backgroundColor: '#022f63',
    display: 'inline-block',
    width: 32,
    height: 32,
    lineHeight: '32px',
    textAlign: 'center',        
    borderRadius: '50%',
    color: '#fff',
    // marginRight: 10,
}

const CircleTheNumberInTheText = (props) => {
    // const { index } = props
    // Nếu text là rỗng thì in số + ''
    // let text = props.text.match(/\d{1,2}\./) ? props.text : `${index}. ` + props.text
    const arrText = props.text.split(/(\d{1,2}\.)/)
    const newText = arrText.map((item, index) => {
        const number = item.match(/\d{1,2}(?=\.)/) // lấy số không lấy dấu '.', vd: 1. => 1
        if (number) return <span key={index} style={circleStyle}>{number}</span>
        const handledItem = handleDisplay(item, index)
        return handledItem
    })
    return <span>{newText}</span>
}

const handleDisplay = (item, index) => {
    const arr = item.replaceAll('&', '').split('')// xử lý dấu & cho các trường hợp khoanh tròn ngoài ý muốn.
    let bold = 0;
    let underline = 0;
    let italic = 0;
    const newArr = arr.map((text) => {
        switch (text) {
            case "|":
                if (bold % 2 === 0 && bold !== item.split('|').length - 2) {// Chỉ mở tag strong khi đủ 1 cặp, khác length-2 cho trường hợp bị lẻ không đủ cặp.
                    bold++
                    return '<strong>'
                }
                if (bold % 2 === 1) { // Đóng tag strong
                    bold++
                    return '</strong>'
                }
                break;
            case "~":
                if (underline % 2 === 0 && underline !== item.split('~').length - 2) {// tương tự với strong
                    underline++
                    return '<u>'
                }
                if (underline % 2 === 1) {
                    underline++
                    return '</u>'
                }
                break;
            case "`":
                if (italic % 2 === 0 && italic !== item.split('`').length - 2) {// tương tự với strong
                    italic++
                    return '<i>'
                }
                if (italic % 2 === 1) {
                    italic++
                    return '</i>'
                }
                break;
            default:
                return text
        }
    })
    return <span key={index}>{ReactHtmlParser(newArr.join(''))}</span>// parse string qua html để những thẻ strong,u,i thành thẻ html
}

CircleTheNumberInTheText.propTypes = {
    text: PropTypes.string,
    index: PropTypes.any
}

CircleTheNumberInTheText.defaultProps = {
    text: '',
}

export default CircleTheNumberInTheText
