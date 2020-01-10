import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './errorTagStyle.css';

export default class ErrorTag extends React.Component {

    public props: any;
    
    constructor(props: any) {
        super(props);
    }

    render() {
        if (this.props.value) {
            return (
                <div className='errorTag'>
                    <div className='errorTagBody'>{this.props.value}</div>
                </div>
            );
        } else {
            return null
        }
    }
}