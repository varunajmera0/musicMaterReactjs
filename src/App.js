import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {FormControl, FormGroup, InputGroup, Glyphicon} from 'react-bootstrap';
import Profile from './components/Profile';
import Gallery from './components/Gallery';
import * as request from 'request';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            artist: null,
            tracks: [],
            access_token: ''
        }
    }
    componentWillMount() {
        const CLIENT_ID = '6f7573d8681947f09ed00428db4ca064';
        const CLIENT_SECRET = '043cfbede3e84312a7dc74f878a65dac';
        // const request = require('request'); // "Request" library

        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };

        const component = this;

        request.post(authOptions, function(error, response, body) {
            component.saveAccessToken(body.access_token);
        });
    }

    saveAccessToken(token) {
        this.setState({access_token: token});
    }
    search() {
        console.log(this.state)
        const t = 'https://accounts.spotify.com/authorize?'
        const BASE_URL = 'https://api.spotify.com/v1/search?';
        let FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1`;
        console.log(FETCH_URL)
        const ALBUM_URL = 'https://api.spotify.com/v1/artists/';
        // var accessToken = 'BQBGbeU_99oOF5LB01Nmzb-EnbGLvhlGiFnKIPDfmQv41UxYkDfrZ09nZo9QnhteaWNS2C2I6ZyNl9G9AzVmiaoyWTkAa4kcpIK1cI1SLDCA_9BXIT6JokGXlWiX3ZA7C9oOleuIm5C6Pjgu2aYCUNF7ZgLIv2E93ANtDE2t6Zq9UNTrTR0';
        var myHeaders = new Headers();
        var myOptions = {
            method: 'GET',
            headers:  {
                'Authorization': 'Bearer ' + this.state.access_token
            },
            mode: 'cors',
            cache: 'default'
        };
        fetch(FETCH_URL, myOptions )
            .then(response => response.json())
            .then(json => {
                const artist = json.artists.items[0];
                this.setState({artist});
                FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=DE`;
                fetch(FETCH_URL, myOptions)
                    .then(response => response.json())
                    .then(json => {
                        console.log('tracks', json)
                        const {tracks} = json;
                        this.setState({tracks});
                    })
            })
    }
  render() {
    return (
      <div className="App">
        <div className="App-title">Music Master</div>
          <FormGroup>
              <InputGroup>
                  <FormControl
                      type="text"
                      placeholder="Search For an Artist"
                      value={this.state.query}
                      onChange={event => {this.setState({query: event.target.value})}}
                      onKeyPress={event => {
                          if (event.key === "Enter") {
                              this.search()
                          }
                      }}
                  />
                  <InputGroup.Addon onClick={() => this.search()}>
                      <Glyphicon glyph="search"/>
                  </InputGroup.Addon>
              </InputGroup>
          </FormGroup>
          {
              this.state.artist !== null
              ?
                  <div>
                      <Profile
                          artist={this.state.artist}
                      />
                      <Gallery tracks={this.state.tracks}/>
                  </div>
              :
                  <div></div>
          }
      </div>
    );
  }
}

export default App;
