import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import FormElement from '../../FormElement/FormElement'
import Request from '../../../services/Request'
import { login, showDialog } from '../../../actions'
import { ERROR_ALLFIELDSMANDATORY, URL_LOGIN, LSKEY_USERNAME, LSKEY_TOKEN, LSKEY_TOKEN_EXPIRATIONTIME, TOKEN_EXPIRATION_TIME } from '../../../config/constants'

const mapStateToProps = state => ({
    isLoggedIn: state.login != null
})

const mapDispatchToProps = dispatch => ({
    login: (username, token) => dispatch(login(username, token)),
    showPopup: (title, message) => dispatch(showDialog(title, message))
})

class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            isProcessingLogin: false
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    handleClick() {
        if (this.state.username == "" || this.state.password == "") {
            this.props.showPopup(1, ERROR_ALLFIELDSMANDATORY);
        } else {
            this.setState({
                isProcessingLogin: true
            });

            const request = new Request().getRequestInstance();
            request.post(URL_LOGIN, {
                username: this.state.username,
                password: this.state.password
            }).then((response) => {
                if(response != null && response.data != null) {
                    const username = this.state.username;

                    localStorage.setItem(LSKEY_USERNAME, username);
                    localStorage.setItem(LSKEY_TOKEN, response.data);

                    var tokenExpirationTime = new Date();
                    tokenExpirationTime.setHours(tokenExpirationTime.getHours() + TOKEN_EXPIRATION_TIME);
                    localStorage.setItem(LSKEY_TOKEN_EXPIRATIONTIME, tokenExpirationTime);

                    this.props.login(username, response.data);
                }
            }).catch((error) => {
                console.log(error.response);
                var errorMessage = 'Authorization Error';
                if (error != null && error.response != null && error.response.data != null && error.response.data.message != null) {
                    errorMessage = error.response.data.message;
                }
                this.props.showPopup(0, errorMessage);
            }).finally(() => {
                this.setState({
                    isProcessingLogin: false
                });
            });
        }
    }

    render() {

        if (!this.state.isProcessingLogin && this.props.isLoggedIn) {
            return <Redirect to='/' />;
        }

        let formStyle = {
            marginTop: '7%'
        };

        return (
            <Form style={formStyle}>
                <FormElement controlId={"formUsername"} label={"Username"} type={"text"} onChange={this.handleUsernameChange} value={this.state.username} />
                <FormElement controlId={"formPassword"} label={"Password"} type={"password"} onChange={this.handlePasswordChange} value={this.state.password} />
                <Button variant="primary" onClick={this.handleClick} disabled={this.state.isProcessingLogin}>Login</Button>
            </Form>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)