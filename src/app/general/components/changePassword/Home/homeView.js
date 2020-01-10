import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../comman/header/header';
import SideNav from '../comman/sidenav/sidenav';
import Overlay from '../comman/overlay/overlay';
import Footer from '../comman/footer/footer';
import './homeStyle.css';

export default class HomeView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="myHome" className="myHomeContainer container">
            <h3>React Web</h3>
            <p>Take a good starter for building a reactive web application.</p>
            </div>
        )
    }
}