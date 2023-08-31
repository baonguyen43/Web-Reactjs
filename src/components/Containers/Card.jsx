/* eslint-disable react/prop-types */
import React from 'react';
import { Card as BSCard, CardHeader, CardBody } from 'reactstrap';

const Card = ({ title, subTitle, children, footer, style, bodyStyles, className, headerClassName, titleClassName, extra }) => {
  return (
    <BSCard style={style} className={`${className}`}>
      {title && (
        <CardHeader className={headerClassName}>
          <div className='tw-flex'>
            <div className='tw-flex-1'>
              {subTitle && <h6 className='text-uppercase text-muted ls-1 mb-1'>{subTitle.toUpperCase()}</h6>}
              <h3 className={`mb-0 ${titleClassName}`}>{typeof title === 'string' ? title.toUpperCase() : title}</h3>
            </div>
            <div className='tw-flex-shrink-0'>{extra}</div>
          </div>
        </CardHeader>
      )}
      <CardBody style={bodyStyles}>{children}</CardBody>
      {footer}
    </BSCard>
  );
};

Card.defaultProps = {
  subTitle: null,
  style: null,
  bodyStyles: null,
  children: null,
  className: null,
  headerClassName: null,
  titleClassName: null,
  footer: null,
  extra: null,
};

export default Card;
