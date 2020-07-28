import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment, Button } from 'semantic-ui-react'


import './App.css'
import Auth from './auth/Auth'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Recipes } from './components/Recipes'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
      return (
         <div className="page-container">
            <header className="mt-2">
               <Grid>
                  <Grid.Row columns={2}>
                     <Grid.Column>
                        <h2>Recipe Book</h2>
                     </Grid.Column>
                     <Grid.Column>
                        {this.generateMenu()}
                     </Grid.Column>
                  </Grid.Row>
               </Grid>
            </header>
            <div className="page-body">
               <Router history={this.props.history}>
                  {this.generateCurrentPage()}  
               </Router>
            </div>
         </div>
      )
   }
   /*{ <Segment style={{ padding: '8em 0em' }} vertical>
     <Grid container stackable verticalAlign="middle">
       <Grid.Row>
         <Grid.Column width={16}>
           <Router history={this.props.history}>
             {this.generateMenu()}

             {this.generateCurrentPage()}
           </Router>
         </Grid.Column>
       </Grid.Row>
     </Grid>
   </Segment> }*/

  generateMenu() {
   if (this.props.auth.isAuthenticated()) {
      return (
         <div className="header-menu">
            <Button basic color='grey' onClick={this.handleLogout}>
               Log Out
            </Button>
         </div>
      )
   } else {
      return (
         <div className="header-menu">
            <Button basic color='blue' onClick={this.handleLogin}>
               Log In
            </Button>
         </div>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Recipes {...props} auth={this.props.auth} />
          }}
        />
        <Route component={NotFound} />
      </Switch>
    )
  }
}
