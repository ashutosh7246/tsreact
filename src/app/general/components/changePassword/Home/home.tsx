import React, { Component } from 'react';
import HomeView from './homeView';
import ReactGA from 'react-ga';

export default class Home extends React.Component {

  public props: any;

  constructor(props: any) {
    super(props);
  }

  componentWillMount() {

    // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
    ReactGA.initialize('UA-124601541-1');
    // This just needs to be called once since we have no routes in this case.
    ReactGA.pageview('Home Page');
  }
  render() {
    return (
      <HomeView {...this.props} />
    );
  }
}
