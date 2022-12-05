import React, { useContext, useSyncExternalStore, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box'
import { Button } from '@mui/material';


export default function YouTubePlayerExample() {
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT
    
    const videoRef = useRef();

    const { store } = useContext(GlobalStoreContext);

    //LETS GET THE SONGS FROM THE CURRENT LIST
    let songsArray = [];
    let completeSongInfo = [];

    if(store.currentList.songs.length === 0) {
        songsArray = [];
        completeSongInfo = [];
    }
    else {
        for(let i = 0; i < store.currentList.songs.length; i++) {
            let song = store.currentList.songs[i];
            let songID = song.youTubeId;
            songsArray.push(songID);
            completeSongInfo.push(song);
        }
    }

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let playlist = songsArray;

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let currentSong = 0;


    const playerOptions = {
        height: '230',
        width: '530',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    function handlePause() {
        console.log(videoRef);
        console.log(videoRef.current);
        videoRef.current.internalPlayer.pauseVideo();
    }

    function handlePlay() {
        videoRef.current.internalPlayer.playVideo();
    }

    function handleRewind() {
        decSong();
        let song = playlist[currentSong];
        videoRef.current.internalPlayer.loadVideoById(song);
        videoRef.current.internalPlayer.playVideo();
    }

    function handleForward() {
        incSong();
        let song = playlist[currentSong];
        videoRef.current.internalPlayer.loadVideoById(song);
        videoRef.current.internalPlayer.playVideo();
    }


    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
        
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length; //TO ENSURE LOOP BACK
    }

    function decSong() {
        currentSong--;
        currentSong = currentSong % playlist.length;
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }


    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        if(store.currentList.songs.length > 0) {
            let playerStatus = event.data;
            let player = event.target;
            console.log(player);
            if (playerStatus === -1) {
                // VIDEO UNSTARTED\
                console.log("-1 Video unstarted");
            } else if (playerStatus === 0) {
                // THE VIDEO HAS COMPLETED PLAYING
                console.log("0 Video ended");
                incSong();
                loadAndPlayCurrentSong(player);
            } else if (playerStatus === 1) {
                // THE VIDEO IS PLAYED
                console.log("1 Video played");
            } else if (playerStatus === 2) {
                // THE VIDEO IS PAUSED
                console.log("2 Video paused");
            } else if (playerStatus === 3) {
                // THE VIDEO IS BUFFERING
                console.log("3 Video buffering");
            } else if (playerStatus === 5) {
                // THE VIDEO HAS BEEN CUED
                console.log("5 Video cued");
            }
            document.getElementById("current-song-number").innerHTML = "Song#: " + currentSong;
            document.getElementById("current-song-title").innerHTML = "Title: " + completeSongInfo[currentSong].title;
            document.getElementById("current-song-artist").innerHTML = "Artist: " + completeSongInfo[currentSong].artist;
            }
        }


        let youTubeElement = 
        <div id = "youtube-player">
            <YouTube
            videoId={playlist[currentSong]}
            opts={playerOptions}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            ref={videoRef}></YouTube>
            <div id = "youtube-info-box">
            <Box
            sx={{borderRadius:"2px", p: "29px", width: '82%', bgcolor: '#8000F00F', display: 'grid'}}
            >
            <span id = "now-playing">Now Playing</span>
            <span id = "song-info">Playlist: {store.currentList.name} </span>
            <span id = "current-song-number">{(store.currentList.songs.length > 0) ? currentSong : ""}</span>
            <span id = "current-song-title">{(store.currentList.songs.length > 0) ? completeSongInfo[currentSong].title : ""}</span>
            <span id = "current-song-artist">{(store.currentList.songs.length > 0) ? completeSongInfo[currentSong].artist : ""}</span>
            <span id = "playlist-buttons"><Button sx={{ml: 13.5}} onClick={() => handlePause()}>Pause</Button><Button onClick = {() => handlePlay()}>Play</Button><Button onClick = {() => handleRewind()}>Rewind</Button><Button onClick = {() => handleForward()}>Skip</Button></span>
            </Box>
            </div>
        </div>

    return ( 
        youTubeElement
    );
}

