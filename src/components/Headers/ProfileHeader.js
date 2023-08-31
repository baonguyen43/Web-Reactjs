/*!

=========================================================
* Argon Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';

// reactstrap components
import { Container, Row, Col } from 'reactstrap';
import * as Colors from 'configs/color'
import PropTypes from 'prop-types';
class ProfileHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const colorClassName = `mask bg-${Colors.PRIMARY} opacity-6`
    const { loggedInUser } = this.props;
    return (
      <>
        <div
          className="header pb-6 d-flex align-items-center"
          style={{
            minHeight: '350px',
            backgroundImage:
              'url("' +
              'https://ames.edu.vn/content/ames/assets/new/course/ielts/bottom.jpg' +
              '")',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        >
          <span className={colorClassName} />

          <Container className="d-flex align-items-center" fluid>
            <Row>
              <Col lg="10" md="10">
                <h1 className="display-3 text-white">
                  {loggedInUser.userMyames?.StudentName}
                </h1>
                {loggedInUser.userMyames && <p className="text-white mt-0 mb-5 text-center">
                  Đây là trang hồ sơ của bạn. Bạn có thể tiến hành thao tác cập
                  nhật dữ liệu cá nhân tại đây
                </p>}
                {/* <Button
                  className="btn-neutral"
                  color="default"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  Edit profile
                </Button> */}
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}
ProfileHeader.propTypes = {
  loggedInUser: PropTypes.instanceOf(Object)
}
export default ProfileHeader;
