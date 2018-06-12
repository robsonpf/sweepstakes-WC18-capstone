import React, { Component } from 'react';
import {
  Button, Card, CardHeader,
  CardFooter, CardBody, CardTitle,
  CardText, Container, Row, Col, Alert
 } from 'reactstrap';
import {
  Flag, Dropdown, Form,
  Image, Dimmer, Loader,
  Label
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { matchesByDay, fetchTeams, fetchStadiums } from '../redux/actions/matches';
import { fetchUsers } from '../redux/actions/users';
import FlagIconFactory from 'react-flag-icon-css';
import Moment from 'react-moment';
import { postBet } from '../redux/actions/bets'

const options2 = [
  { key: '1', text: '0', value: '0' },
  { key: '2', text: '1', value: '1' },
  { key: '3', text: '2', value: '2' },
  { key: '4', text: '3', value: '3' },
  { key: '5', text: '4', value: '4' },
  { key: '6', text: '5', value: '5' },
  { key: '7', text: '6', value: '6' },
  { key: '8', text: '7', value: '7' },
  { key: '9', text: '8', value: '8' },
  { key: '10', text: '9', value: '9' },
  { key: '11', text: '10', value: '10' }
]

class CardMatch extends Component {

  state = {
    bets: [],
    isValidForm: true,
    isValid: true
  }

  // handleToggleMatchBets = () => {
  //   this.setState({ : !this.state. })
  // }

  handleBetSubmit = (e) => {
    e.preventDefault()
    console.log("this.props.user", this.props.user);
    let findUserBets = this.props.user.bets.find(bet => bet.matchId === this.props.match.id)

    if (findUserBets === undefined) {
      this.setState({
        isValidForm: true,
        isValid: true
      })
      console.log(this.props.match.id);
      this.props.postBet({
          "finalResult": [ this.state.homeTeamGoals, this.state.awayTeamGoals ],
          "winnerTeam": this.props.homeTeam.name === this.state.winner
              ? this.props.homeTeam.id
              : this.props.awayTeam.name === this.state.winner
              ? this.props.awayTeam.id : 0,
          "matchId": this.props.match.matchId
        })
    } else {
      this.setState({
      invalidForm: this.state.isValidForm + 'is invalid',
      isValid: false
      })
    }
  }

  render() {
    let {
      matchday,
      group,
      homeTeam,
      matchId,
      date,
      awayTeam,
      stadium,
      _id,
      type
    } = this.props.match;

    const options1 = [
    { key: this.props.homeTeam.name, value: this.props.homeTeam.id, text: this.props.homeTeam.name},
    { key: this.props.awayTeam.name, value: this.props.awayTeam.id, text: this.props.awayTeam.name},
    { key: 0, value: 0, text: "Tied match"}
    ];

    return (
      <div>
        <Container style={{ marginTop: '20vh', marginBottom: '10vh' }} >
          {this.props.isLoading ? (
            <Dimmer active>
              <Loader>Fetching Data</Loader>
            </Dimmer>
          ) : null}
          <Card>
            <CardHeader>
              <Row>
                <Moment  tag="h3">
                  {date}
                </Moment>
              </Row>
              <Row>
                <CardText>
                  <Moment fromNow>{date}</Moment>
                </CardText>
              </Row>
              <Row>
                <CardText>Group: {group}</CardText>
              </Row>
              <Row>
                <CardText>{this.props.stadium.name}</CardText>
              </Row>
              <Row>
                <CardText>{this.props.stadium.city}</CardText>
              </Row>
              <Label
                as='a'
                color='orange'
                content='Show all users bet'
                // content={ !this.state.showMap ? 'Show all users bet' : 'Show matches'}
                ribbon='right'
                // onClick={ this.handleToggleMap }
              ></Label>
            </CardHeader>
            <CardBody style={{ backgroundColor:'#D4D8DB' }}>
              <Row style={{  marginTop: '7vh', marginBottom: '7vh'  }}>
                <Col>
                  <Row>
                    <Col>
                      <CardTitle style={{ fontSize:30 }}>
                        {this.props.homeTeam.name}
                      </CardTitle>
                    </Col>
                    <Col>
                      <Image size='small' src={this.props.homeTeam.flag} />
                    </Col>
                    <Col>
                      <CardTitle style={{ fontSize:30 }}> vs </CardTitle>
                    </Col>
                    <Col>
                      <Image  size='small' src={this.props.awayTeam.flag}/>
                    </Col>
                    <Col>
                      <CardTitle style={{ fontSize:30 }}>
                        {this.props.awayTeam.name}
                      </CardTitle>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Form>
                <Form.Group widths='equal'>
                  <Form.Select fluid label='Enter number of goals score from:'
                    options={options2} placeholder={this.props.homeTeam.name}
                    onChange={e => this.setState({ homeTeamGoals: e.target.textContent })}/>
                  <Form.Select fluid label='Enter number of goals score from:'
                    options={options2} placeholder={this.props.awayTeam.name}
                    onChange={e => this.setState({ awayTeamGoals: e.target.textContent })}/>
                  <Form.Select fluid label='Winner' options={options1}
                    placeholder='Choose a winner or a tied match'
                    onChange={e => this.setState({ winner: e.target.textContent })}/>
                </Form.Group>
                { !this.props.isValid ? (
                  <Alert color="danger">Bet already made for this match!</Alert>
                ) : null }
                <Form.Button onClick={this.handleBetSubmit.bind(this)}>Make your Bet</Form.Button>
              </Form>
            </CardFooter>
          </Card>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: state.users.allUsers.find(user => user.userName === state.auth.user.userName) || {},
    homeTeam: state.matches.allTeams.find(team => props.match.homeTeam === team.id) || {},
    awayTeam: state.matches.allTeams.find(team => props.match.awayTeam === team.id) || {},
    stadium: state.matches.allStadiums.find(stadium => props.match.stadium === stadium.id) || {},
    isValid: ( state.bets.matchId === props.match.matchId ) ? state.bets.isValid : true ,
  }
};

const mapDispatchToProps = dispatch => bindActionCreators({
  matchesByDay, fetchTeams, fetchStadiums, fetchUsers, postBet }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CardMatch);
