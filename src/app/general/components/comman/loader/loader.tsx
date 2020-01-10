import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loaderStyle.css';

export default class Loader extends React.Component {

    public props: any;
    
    constructor(props: any) {
        super(props);
    }

    render() {
        if (this.props.value) {
            return (
                <div id='loader' className='overlay'>
                    <div className='loaderParent'>
                        <div className='loader'></div>
                    </div>
                </div>
            )
        } else {
            return null
        }
    }
}