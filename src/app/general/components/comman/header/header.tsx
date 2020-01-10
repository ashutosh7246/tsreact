import React, { Component } from 'react';
import HeaderView from './headerView';

export default class Header extends React.Component {

  public props: any;

  constructor(props: any) {
    super(props);
  }

  state = {
    sideNavOpened: false
  }

  openSideNav = () => {
    if (this.state.sideNavOpened) {
      if (document.getElementById("mysidenavOverlay")) {
        let element: any = document.getElementById("mysidenavOverlay");
        if (element && element.style) {
          element.style['visibility'] = 'hidden';
          element.style['opacity'] = '0';
          element.style['marginLeft'] = '0px';
        }
      }
      if (document.getElementById("mySidenav")) {
        let element: any = document.getElementById("mySidenav");
        if (element && element.style) {
          element.style['marginLeft'] = '-300px';
        }
      }
      this.setState({ sideNavOpened: false });
    } else {
      if (document.getElementById("mysidenavOverlay")) {
        let element: any = document.getElementById("mysidenavOverlay");
        if (element && element.style) {
          element.style['visibility'] = 'visible';
          element.style['opacity'] = '1';
          element.style['marginLeft'] = '300px';
        }
      }
      if (document.getElementById("mySidenav")) {
        let element: any = document.getElementById("mySidenav");
        if (element && element.style) {
          element.style['marginLeft'] = '0px';
        }
      }
      this.setState({ sideNavOpened: true });
    }
  }

  render() {
    return (
      <HeaderView
        openSideNav={this.openSideNav} />
    );
  }
}
