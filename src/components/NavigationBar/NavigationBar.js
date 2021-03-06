import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { showDialog, logout } from '../../actions'
import { LSKEY_USERNAME, LSKEY_TOKEN, LSKEY_TOKEN_EXPIRATIONTIME } from '../../config/constants'
import {
    withRouter
} from 'react-router-dom'

const mapStateToProps = state => ({
    loggedInUsername: state.login != null ? state.login.username : null
})

const mapDispatchToProps = dispatch => ({
    showPopup: (title, message, callback) => dispatch(showDialog(title, message, callback)),
    logout: () => dispatch(logout)
})

const navbarStyling = {
    padding: '15px',
    display: 'inlineBlock',
    lineHeight: '20px',
    cursor: 'pointer'
};

class NavBarTop extends React.Component {

    constructor(props) {
        super(props);
        this.onLoggedOut = this.onLoggedOut.bind(this);
    }

    onLoggedOut() {
        localStorage.removeItem(LSKEY_USERNAME);
        localStorage.removeItem(LSKEY_TOKEN);
        localStorage.removeItem(LSKEY_TOKEN_EXPIRATIONTIME);
        this.props.logout();
        this.props.history.push('/');
    }

    render() {

        const loginLogout = this.props.loggedInUsername == null ?
            <NavItem style={navbarStyling} componentclass="span"><Link to="/login">Login</Link></NavItem> :
            <NavItem style={navbarStyling} onClick={() =>
                this.props.showPopup(1, 'Are sure you want to logout ' + this.props.loggedInUsername + '?', this.onLoggedOut)}>Logout</NavItem>

        return (
            <Navbar bg="light" expand="lg" >
                <Navbar.Brand><Link to="/">Demo Bank</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavItem style={navbarStyling} componentclass="span"><Link to="/users">Users</Link></NavItem>
                        <NavItem style={navbarStyling} componentclass="span"><Link to="/currency">Currency</Link></NavItem>
                        <NavItem style={navbarStyling} componentclass="span"><Link to="/transfer">Transfer</Link></NavItem>
                        <NavItem style={navbarStyling} componentclass="span"><Link to="/history">Transaction History</Link></NavItem>
                    </Nav>
                    <Nav className="ml-auto">
                        {this.props.loggedInUsername == null ? <NavItem style={navbarStyling} componentclass="span"><Link to="/register">Register</Link></NavItem> : null}
                        {loginLogout}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBarTop));