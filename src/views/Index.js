
/*eslint-disable*/
import React from "react";
// react library for routing
import { Link } from "react-router-dom";
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import IndexHeader from "components/Headers/IndexHeader.js";
import AuthFooter from "components/Footers/AuthFooter.js";

class Index extends React.Component {

  render() {
    return (
      <>
        <IndexNavbar {...this.props}/>
        <div className="main-content">
          <IndexHeader {...this.props} />
          <section className="py-6 pb-9 bg-default">
            <Container fluid>
              <Row className="justify-content-center text-center">
                <Col md="6">
                  <h2 className="display-3 text-white">Học tại AMES ENGLISH</h2>
                  <p className="lead text-white">
                    Cho đến nay, AMES ENGLISH đã xây dựng thành công hệ thống 25
                    trung tâm trên toàn quốc, với hơn 100.000 học viên, cung cấp
                    các khóa đào tạo : Tiếng Anh Trẻ Em - Luyện thi IELTS cam
                    kết đầu ra - Tiếng Anh Doanh Nghiệp và Du học.
                  </p>
                </Col>
              </Row>
            </Container>
          </section>
          <section className="section section-lg pt-lg-0 mt--7">
            <Container>
              <Row className="justify-content-center">
                <Col lg="12">
                  <Row>
                    <Col lg="4">
                      <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                          <div className="icon icon-shape bg-gradient-info text-white rounded-circle mb-4">
                            <i className="ni ni-check-bold" />
                          </div>
                          <h4 className="h3 text-info text-uppercase">
                            Xây dựng môi trường học Tiếng Anh ưu việt
                          </h4>
                          <p className="description mt-3">
                            Các khóa học Tiếng Anh Trẻ Em tại AMES ENGLISH, song
                            song với việc dạy học trên lớp với giáo viên nước
                            ngoài, học viên sẽ được rèn luyện thành thói quen
                            luyện tập Tiếng Anh mỗi ngày tại nhà, đặc biệt là
                            luyện tập phát âm chuẩn Mỹ bằng A.I.
                          </p>
                          <div>
                            <Badge color="info" pill>
                              Phát âm chuẩn Mỹ bằng A.I
                            </Badge>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg="4">
                      <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                          <div className="icon icon-shape bg-gradient-success text-white rounded-circle mb-4">
                            <i className="ni ni-istanbul" />
                          </div>
                          <h4 className="h3 text-success text-uppercase">
                            Cam kết và đảm bảo chất lượng
                          </h4>
                          <p className="description mt-3">
                            Chất lượng đầu ra là điều được coi trọng hàng đầu
                            tại AMES ENGLISh với những cam kết cụ thể: Cải thiện
                            điểm Tiếng Anh ở trường. Tự tin giao tiếp và phát âm
                            chuẩn Tiếng Anh. Cam kết đầu ra chứng chỉ Quốc tế
                            Cha mẹ dễ dàng theo dõi
                          </p>
                          <div>
                            <Badge color="success" pill>
                              Cải thiện điểm
                            </Badge>
                            <Badge color="success" pill>
                              Tự tin giao tiếp
                            </Badge>
                            <Badge color="success" pill>
                              Chứng chỉ Quốc tế
                            </Badge>
                            <Badge color="success" pill>
                              Dễ dàng theo dõi
                            </Badge>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg="4">
                      <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                          <div className="icon icon-shape bg-gradient-warning text-white rounded-circle mb-4">
                            <i className="ni ni-planet" />
                          </div>
                          <h4 className="h3 text-warning text-uppercase">
                            Phương pháp học tiếng Anh hiệu quả gấp 7 lần
                          </h4>
                          <p className="description mt-3">
                            Chỉ ra từ Tháp học tập từ Viện nghiên cứu đào tạo
                            Quốc gia Hoa Kỳ, Phương pháp học Tiếng Anh 4P áp
                            dụng tại AMES ENGLISH được coi là một trong những
                            cách học Tiếng Anh hiệu quả nhất trên thế giới
                          </p>
                          <div>
                            <Badge color="warning" pill>
                              Productivity
                            </Badge>
                            <Badge color="warning" pill>
                              Participatory Method
                            </Badge>
                            <Badge color="warning" pill>
                              Partnership
                            </Badge>
                            <Badge color="warning" pill>
                              Practical
                            </Badge>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </section>
          <section className="py-6">
            <Container>
              <Row className="row-grid align-items-center">
                <Col className="order-md-2" md="6">
                  <img
                    alt="..."
                    className="img-fluid"
                    src={require("assets/img/brand/thaphoctap2019.png")}
                  />
                </Col>
                <Col className="order-md-1" md="6">
                  <div className="pr-md-5">
                    <h2 className='text-center'>
                      Sử dụng phương pháp học tiếng anh "Tháp học tập"
                    </h2>

                    <ul className="list-unstyled mt-5">
                      <li className="py-2">
                        <div className="d-flex align-items-center">
                          <div>
                            <Badge
                              className="badge-circle mr-3"
                              color="success"
                            >
                              <i className="ni ni-settings-gear-65" />
                            </Badge>
                          </div>
                          <div>
                            <h4 className="mb-0">
                              Cải thiện điểm Tiếng Anh ở trường
                            </h4>
                          </div>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="d-flex align-items-center">
                          <div>
                            <Badge
                              className="badge-circle mr-3"
                              color="success"
                            >
                              <i className="ni ni-html5" />
                            </Badge>
                          </div>
                          <div>
                            <h4 className="mb-0">
                              Tự tin giao tiếp và phát âm chuẩn Tiếng Anh
                            </h4>
                          </div>
                        </div>
                      </li>
                      <li className="py-2">
                        <div className="d-flex align-items-center">
                          <div>
                            <Badge
                              className="badge-circle mr-3"
                              color="success"
                            >
                              <i className="ni ni-satisfied" />
                            </Badge>
                          </div>
                          <div>
                            <h4 className="mb-0">
                              Cam kết đầu ra chứng chỉ Quốc tế
                            </h4>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </div>
        <AuthFooter />
      </>
    );
  }
}

export default Index;
