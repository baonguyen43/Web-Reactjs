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
// react library for routing

// reactstrap components
import { Button, Card, CardBody, Container, Row, Col } from 'reactstrap';

class IndexHeader extends React.Component {

  render() {
    return (
      <>
        <div className="header bg-info pt-4 pb-7">
          <Container>
            <div className="header-body">
              <Row className="align-items-center">
                <Col lg="6">
                  <div className="pr-5">
                    <h2 className="display-3 text-white text-center">AMES ENGLISH</h2>

                    <h2 className="display-4 text-white font-weight-light">
                      Anh ngữ Ames luyện thi IELTS và tiếng Anh cho trẻ em hàng đầu tại Việt Nam
                    </h2>
                    <p className="text-white mt-4">
                      Thành lập từ năm 2003, sau hơn 15 năm phát triển, Hệ thống Anh ngữ Quốc tế AMES - AMES ENGLISH tự hào là đơn vị tiên phong ứng dụng công nghệ trí tuệ nhân tạo vào giảng dạy, trở thành tổ chức đào tạo Tiếng Anh chất lượng hàng đầu tại Việt Nam.
                    </p>
                    <div className="mt-5">
                      <Button
                        className="btn-neutral my-2"
                        color="default"
                        target='_blank'
                        href="https://ames.edu.vn/gioi-thieu-ve-ames"
                      >
                        Giới thiệu chung
                      </Button>
                      <Button
                        className="my-2"
                        color="default"
                        target='_blank'
                        href="https://ames.edu.vn/phuong-phap-hoc-tieng-anh-cua-ames"
                      >
                        Phương pháp học
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <Row className="pt-5">
                    <Col md="6">
                      <Card>
                        <CardBody>
                          <div className="icon icon-shape bg-gradient-red text-white rounded-circle shadow mb-4">
                            <i className="fas fa-chart-bar"></i>
                          </div>
                          <h5 className="h3">
                            4P- Gấp 7 lần hiệu quả</h5>
                          <p>
                            Gấp 7 lần hiệu quả học Tiếng Anh bằng phương pháp Khoa học của Viện nghiên cứu đào tạo quốc gia - Hoa Kỳ
                           </p>
                        </CardBody>
                      </Card>
                      <Card>
                        <CardBody>
                          <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow mb-4">
                            <i className="fas fa-user-graduate"></i>
                          </div>
                          <h5 className="h3">Học 1 thầy - 1 trò</h5>
                          <p>
                            Luyện phát âm 1 - 1 với giáo viên Bản ngữ
                            .Mỗi học sinh có chương trình học riêng, được thiết kế phù hợp với từng cá nhân
                            Giảng viên 1 - 1 theo dõi và hướng dẫn từng bài học
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col className="pt-lg-5 pt-4" md="6">
                      <Card className="mb-4">
                        <CardBody>
                          <div className="icon icon-shape bg-gradient-success text-white rounded-circle shadow mb-4">
                            <i className="fas fa-user-clock"></i>
                          </div>
                          <h5 className="h3">Giờ học linh động</h5>
                          <p>
                            Chọn giờ học phù hợp - Học bù thời gian linh hoạt không lo mất buổi - Đến học khi tâm lý thoải mái nhất
                          </p>
                        </CardBody>
                      </Card>
                      <Card className="mb-4">
                        <CardBody>
                          <div className="icon icon-shape bg-gradient-warning text-white rounded-circle shadow mb-4">
                            <i className="ni ni-active-40" />
                          </div>
                          <h5 className="h3">Cá nhân hóa lộ trình học</h5>
                          <p>
                            Cá nhân hóa chương trình học
                            .Phát triển đồng đều các kỹ năng
                            .Lộ trình học riêng theo từng giai đoạn
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
      </>
    );
  }
}

export default IndexHeader;
