/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQDL7S2t96rFWNr_fkzN6vQlsyFMYORtixzQP4KxNnaOIGIp54Zn0WKQ5zYe34-pSyMrqQXlaT8HHZ5fMorEOqlait8o0xzi9gBepCwn8DjstuVZ_4a-VU1-LXHUM5nIxeoWJjHBam371xHO2TBax5pq';

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}



class AlbumCover extends Component {
  render() {
    const src = this.props.track.album.images[0].url; // A changer ;)
    return (<img src={src} style={{ width: 400, height: 400 }} />);
    
  }
}


class App extends Component {

  constructor() {
    super();
    this.state = {
      text: "",
      tracks: null,
      songsLoaded: false,
      current_id : "",
      currentTrack : null,
      time : null
    };
  }

  componentDidMount(){
    this.setState({ text: "Bonjour !" })
    fetch('https://api.spotify.com/v1/playlists/1wCB2uVwBCIbJA9rar5B77/tracks', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + apiToken,
      },
    })
    .then(response => response.json())
    .then((data) => {
      console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data);
      console.log(data.items[0].track.name);
      this.setState({tracks : data.items});
      var rand = getRandomNumber(data.items.length);
      this.setState({current_id: data.items[rand].track.id});
      this.setState({currentTrack: data.items[rand]});
      this.setState({songsLoaded: true});
      const timeout = setTimeout(() =>this.newSong(), 30000);
      this.setState({time : timeout});
      console.log(this.state);
      
    })

    
  }

  newSong(){
    if (this.state && this.state.tracks){
      var rand = getRandomNumber(this.state.tracks.length);
      this.setState({current_id: this.state.tracks[rand].track.id});
      this.setState({currentTrack: this.state.tracks[rand]});
      const timeout = setTimeout(() =>this.newSong(), 30000);
      this.setState({time : timeout});
    }
    
  }

  checkAnswer(id_song_clicked){
    console.log(id_song_clicked);
    if(id_song_clicked == this.state.current_id){
      swal('Bravo', 'Sous-titre', 'success').then(this.newSong())
      clearTimeout(this.state.time);
    }
    else{
      swal('Alerte !!', 'Ceci est une alerte', 'error')
    }
  }

  render() {

    if( this.state.songsLoaded === true){
      var song1 = this.state.currentTrack;
      var song2 = this.state.tracks[getRandomNumber(this.state.tracks.length)]
      var song3 = this.state.tracks[getRandomNumber(this.state.tracks.length)];

      var array_songs = shuffleArray([song1,song2,song3]);
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">Bienvenue sur le Blindtest de Camille</h1>
          </header>
          <div className="App-images">
            <p>{song1.track.name}</p>
            <AlbumCover track={song1.track} />
            <Sound url={song1.track.preview_url} playStatus={Sound.status.PLAYING}/>
          </div>
          <div className="App-buttons">
          {array_songs.map(item => (
              <Button onClick={() => this.checkAnswer(item.track.id)}>{item.track.name}</Button>
          ))}
          
          </div>
        </div>
      );
    }
    else{
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        </header>
        <div className="App-images">
          <img src={loading} className="App-logo" alt="loading"/>
          <p>Loading data ...</p>
        </div>
        <div className="App-buttons">
        </div>
      </div>
    );
  }
}
}

export default App;
