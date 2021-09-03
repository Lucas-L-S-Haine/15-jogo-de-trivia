import PropTypes from 'prop-types';
import React from 'react';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPlayerInfo, setPlayerToken } from '../actions';
import '../App.css';
import logo from '../trivia.png';
import { fetchPlayerImg, fetchPlayerToken } from '../services/apiHelper';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      nome: '',
      email: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  handleSubmit() {
    const { history, sendToken, sendPlayer } = this.props;
    const { email } = this.state;
    fetchPlayerToken()
      .then(({ token }) => {
        sendToken(token);
        localStorage.setItem('token', token);
        history.push('/game');
      });

    const emailHash = md5(email).toString();
    fetchPlayerImg(emailHash)
      .then(({ url }) => {
        this.setState({
          avatar: url,
        }, () => {
          sendPlayer(this.state);
        });
      });
  }

  render() {
    const { nome, email } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={ logo } className="App-logo" alt="logo" />
          <p>SUA VEZ</p>
          <label htmlFor="nome">
            Nome:
            <input
              type="text"
              name="nome"
              id="nome"
              data-testid="input-player-name"
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="email">
            Email:
            <input
              type="email"
              name="email"
              id="email"
              data-testid="input-gravatar-email"
              onChange={ this.handleChange }
            />
          </label>
          <button
            type="button"
            data-testid="btn-play"
            disabled={ !email || !nome }
            onClick={ this.handleSubmit }
          >
            Jogar
          </button>
          <Link to="/settings">
            <button
              type="button"
              data-testid="btn-settings"
            >
              Configurações
            </button>
          </Link>
        </header>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  sendToken: (payload) => dispatch(setPlayerToken(payload)),
  sendPlayer: (payload) => dispatch(setPlayerInfo(payload)),
});

export default connect(null, mapDispatchToProps)(Login);

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  sendPlayer: PropTypes.func.isRequired,
  sendToken: PropTypes.func.isRequired,
};
