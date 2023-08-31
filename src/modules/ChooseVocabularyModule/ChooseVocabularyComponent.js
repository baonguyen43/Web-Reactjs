import React from 'react';
import { Container, Row } from 'reactstrap';
import CardHomePage from 'pages/Components/Card';
import * as Color from 'configs/color'
// core components
import CardsHeader from 'components/Headers/CardsHeader.js';

class ChooseVocabularyComponent extends React.Component {

  render() {
    return (
      <React.Fragment>
        <CardsHeader {...this.props} showCard={false} name="Choose" parentName="HomePage" parentHref='/ames' />
        <Container className="mt--6" fluid>
          <Row>
            
            <CardHomePage
              {...this.props}
              type='choose'
              title="Vocabulary Practice"
              titleVN="Luyện tập từ vựng"
              detail="Let's start"
              linkTo="/ames/vocabulary"
              color={Color.PRIMARY}
              imgLink={require('assets/img/classes/ames.png')}
            />

            <CardHomePage
              {...this.props}
              type='choose'
              title="Identifying Word Stress"
              titleVN="Xác định trọng âm"
              detail="Let's start"
              linkTo="/ames/stressposition"           
              color="info"
              imgLink={require('assets/img/classes/ames.png')}
            />

          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default ChooseVocabularyComponent;