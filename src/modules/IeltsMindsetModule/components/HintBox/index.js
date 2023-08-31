import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import PropTypes from 'prop-types';
import './styles.hintbox.css';

const HintBox = (props, ref) => {
  const renderHintBox = React.useCallback((node, index) => {
    if (node.type === 'text') {
      // if (!node.data.includes('|')) return;
      const elementArray = node.data.split('|');
      return (
        <span key={index} style={{ justifyContent: 'center' }}>
          {elementArray.map((v, i) => (
            <span key={i} className="render-hint-box">
              {v}
            </span>
          ))}
        </span>
      );
    }
  }, []);

  return (
    <React.Fragment>
      <div
        ref={ref}
        className="main-hint-box"
        style={{ position: 'fixed', backgroundColor: 'white', maxWidth: props.isDivided ? '30%' : '70%' }}
      >
        {ReactHtmlParser(props.content, { transform: renderHintBox })}
      </div>
    </React.Fragment>
  );
};

HintBox.propTypes = {
  content: PropTypes.string,
};

export default React.forwardRef(HintBox);
