import React from 'react';
import classnames from 'classnames';
// reactstrap components
import {
  Card,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Row, Col, Breadcrumb, BreadcrumbItem, Container, Button
} from 'reactstrap';
import { Result } from 'antd'
import { Link } from 'react-router-dom';
import StartOnClass from './components/StarOnClass'
import StarAmes from './components/StarAmes'
import { BackTop } from 'antd';
// import * as Colors from 'configs/color'
const tabs = ['Tổng số sao trên lớp', 'Tổng số sao làm bài MYAMES', 'Danh sách quà tặng tại AMES']

class Navs extends React.Component {
  state = {
    tabs: 1
  };
  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
  };
  render() {
    // const colorClassName = `bg-${Colors.PRIMARY}`
    return (
      <>
        <Container className='mt-4' fluid >
          <Row >
            <Col>
              <CardBody className="text-white" tag="h2" style={{ background: '#0A3162' }}>
                <Link to="/ames">
                  <h6 className="h2 text-white d-inline-block mb-0">HOME PAGE</h6>
                </Link>
                <Breadcrumb
                  className="d-none d-md-inline-block ml-md-4"
                  listClassName="breadcrumb-links breadcrumb-dark"
                >
                  <BreadcrumbItem>
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <i className="fas fa-star"></i>
                    </a>
                  </BreadcrumbItem>
                  <BreadcrumbItem aria-current="page" className="active">
                    Star and Gifts
                </BreadcrumbItem>
                </Breadcrumb>
              </CardBody>
            </Col>
          </Row>
        </Container>
        <Container>
          <div className="nav-wrapper">
            <Nav
              className="nav-fill flex-column flex-md-row"
              id="tabs-icons-text"
              pills
              role="tablist"
            >
              {tabs.map((item, index) => {
                return (
                  <NavItem key={index}>
                    <NavLink
                      aria-selected={this.state.tabs === index + 1}
                      className={classnames('mb-sm-3 mb-md-0', {
                        active: this.state.tabs === index + 1,
                      })}
                      onClick={e => this.toggleNavs(e, 'tabs', index + 1)}
                      href="#pablo"
                      role="tab"
                    >
                      {index === 2 ? <i className="fas fa-gift mr-2"></i> : <i className="fas fa-star mr-2"></i>}
                      {item}
                    </NavLink>
                  </NavItem>
                )
              })}
            </Nav>
          </div>
          <Card className="shadow">
            <CardBody>
              <TabContent activeTab={'tabs' + this.state.tabs}>
                <TabPane tabId="tabs1">
                  <StartOnClass />
                </TabPane>
                <TabPane tabId="tabs2">
                  <StarAmes />
                </TabPane>
                <TabPane tabId="tabs3">
                  <Result
                    status="404"
                    title="Not Found"
                    subTitle="Sorry, we'll come back soon"
                    extra={<Button onClick={() => this.props.history.push('/ames')} type="primary">Back Home</Button>}
                  />,
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
          <BackTop />
        </Container>
      </>
    );
  }
}

export default Navs;