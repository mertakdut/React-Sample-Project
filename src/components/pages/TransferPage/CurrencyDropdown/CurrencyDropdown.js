import React from 'react';
import { Form } from 'react-bootstrap';
import Request from '../../../../services/Request';
import CurrencyDropdownItem from './CurrencyDropdownItem/CurrencyDropdownItem'

class CurrencyDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currencies: []
        }
    }

    onPickCurrency() {
        this.props.onDropdownChanged(this.inputEl.value);
    }

    componentDidMount() {
        const request = new Request().getRequestInstance('https://api.exchangeratesapi.io');
        request.get('/latest?base=TRY')
            .then((response) => {
                this.setState({ currencies: response.data.rates });
                console.log(this.state.currencies);
            }).catch((error) => {
                console.log(error);
            });
    }

    render() {
        const currencies = Object.keys(this.state.currencies).map((keyName, index) =>
            <CurrencyDropdownItem key={index} currency={keyName} />
        );

        return (
            <Form.Control as="select" onChange={this.onPickCurrency.bind(this)} ref={el => this.inputEl = el}>
                <option value="">Select</option>
                {currencies}
            </Form.Control>
        )
    }

}

export default CurrencyDropdown