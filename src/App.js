import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import CornerButton from './components/cornerbutton';
import Booklet from "./components/booklet/booklet";
import Artists from "./components/Artists";
import Songs from "./components/songs";
import { store } from './utils/store'
import Spinner from 'react-spinner-material';

const App = () => {

  const [bookletOpen, setBookletOpen] = useState(false)
  const [data, setData] = useState({})
  const [isLoaded, setIsLoaded] = useState(false);
  const [songsInBooklet, setSongsInBooklet] = useState(store.getState());

  const API_URL = 'https://api.gitarhefte.no'

  // When add or delete song, update number on corner button.
  store.subscribe(() => setSongsInBooklet(store.getState()));

  // Add empty array at first page load. Ready to be filled with selected songs.
  if (!sessionStorage.getItem('booklet')) {
    sessionStorage.setItem('booklet', '[]')
  }

  //!####################################
  //TODO! WHY IS THE API CALLED TWICE!!??
  //!####################################
  
  // Get all artists and songs from database
  if (!isLoaded || !sessionStorage.getItem('data')) {
    fetch(API_URL + '/api')
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem('data', JSON.stringify(data))
        setData(data)
        setIsLoaded(true)
      })
      .catch(error => console.log(error))
  }

  return (
    <Router>
      <Link style={logoLinkStyle} to="/" onClick={_ => setBookletOpen(false)}><h1>Gitarhefte</h1></Link>
      <Link style={bookletLinkStyle} to={{ pathname: bookletOpen ? "/" : "/booklet" }} onClick={_ => setBookletOpen(!bookletOpen)}>
        <CornerButton songsInBooklet={songsInBooklet} bookletOpen={bookletOpen} />
      </Link>
      <Routes>
        <Route path="/" element={<Artists artists={data} dataLoaded={isLoaded} />} />
        <Route path="/:artist"
          element={isLoaded ?
            <Songs artists={data} /> :
            <div style={{ display: "inline-grid", justifyContent: "center", gridRow: '2', gridColumn: '3' }}>
              <Spinner radius={60} color={"#622C06"} stroke={8} visible={true} />
            </div>} />
        <Route path="booklet" element={<Booklet />} />
      </Routes>
    </Router>
  )
}

const bookletLinkStyle = {
  textDecoration: "none",
  gridColumn: "4",
  gridRow: "1",
  justifySelf: "end",
}

const logoLinkStyle = {
  justifySelf: "start",
  textDecoration: "none",
  gridColumn: "2",
  gridRow: "1",
}




export default App;
