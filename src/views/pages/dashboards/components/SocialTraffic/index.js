import React from 'react';
import numeral from 'numeral';
import { Button, Card, CardHeader, Progress, Table, Row } from 'reactstrap';

const mock = [
  {
    name: 'Facebook',
    visitors: 1480,
    percent: 60,
  },
  {
    name: 'TikTok',
    visitors: 5480,
    percent: 80,
  },
  {
    name: 'Instagram',
    visitors: 1240,
    percent: 40,
  },
];

export default function SocialTraffic() {
  return (
    <Card>
      <CardHeader className='border-0'>
        <Row className='align-items-center'>
          <div className='col'>
            <h3 className='mb-0'>Social traffic</h3>
          </div>
          <div className='col text-right'>
            <Button color='default' href='#pablo' onClick={(e) => e.preventDefault()} size='sm'>
              See all
            </Button>
          </div>
        </Row>
      </CardHeader>
      <Table className='align-items-center table-flush' responsive>
        <thead className='thead-light'>
          <tr>
            <th scope='col'>Referral</th>
            <th scope='col'>Visitors</th>
            <th scope='col' />
          </tr>
        </thead>
        <tbody>
          {mock.map((data) => (
            <tr key={data.name}>
              <th scope='row'>{data.name}</th>
              <td className='text-left'>{numeral(data.visitors).format('0,0')}</td>
              <td>
                <div className='d-flex align-items-center'>
                  <span className='mr-2'>{numeral(data.percent).format('0')}%</span>
                  <div>
                    <Progress animated max='100' value='60' color='gradient-success' />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
