import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { AuthContext } from '../auth'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Box from '@mui/material/Box'
import AppBanner from './AppBanner';
import YouTubePlayerExample from './YoutubeAPI';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import SortIcon from '@mui/icons-material/Sort';


/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/

 

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [value, setValue] = React.useState(0);

    const handleTabs = (e, val) => {
        console.warn(val);
        setValue(val);
    }

    function handleCreateNewList() {
        store.createNewList();     
    }

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    useEffect(() => {
        auth.getLoggedIn();
    }, [])

    let listCard = "";
    if (store) {
        listCard = 
        <List sx={{width: '100%'}}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        userFirst = {pair.userFirstName}
                        userLast = {pair.userLastName}
                        listenNumber = {pair.listenAmount}
                        createAt ={pair.createDate}
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
        </List>;
    }
    
    function TabPanel(props) 
    {
        const {children, value, index} = props;
          return (<div>
            {
            value === index && (
                <h1>{children}</h1>
            )
            }
          </div>)
    }

    let stringComplete = "";

    function handleKeyPress(event, id) {
        if(event.code === 'Enter') {
            store.createComment(stringComplete, id);
        }
    }

    const handleUpdateText = (valueAmount) => {
        stringComplete = valueAmount
    }

    let playListInfo = "";

    const handleSearchPlaylist = (searchAmount) => {
        playListInfo = searchAmount;
    }

    function handleSearchPress(event) {
        if(event.code === 'Enter') {
            console.log(playListInfo);
            store.searchPlaylist(playListInfo);
        }
    }

    let filteredIdNamePairs = [];

    if(store.isSearched === true) {
        console.log(playListInfo);
        filteredIdNamePairs = store.idNamePairs.filter((pair) => pair.name.includes(playListInfo));
        console.log(filteredIdNamePairs);
        listCard =
        <List sx={{width: '100%'}}>
            {
                filteredIdNamePairs.map((pair) => (
                    <ListCard
                        userFirst = {pair.userFirstName}
                        userLast = {pair.userLastName}
                        listenNumber = {pair.listenAmount}
                        createAt ={pair.createDate}
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
        </List>;
    }

    const youtubePlayer = React.useMemo(() => <YouTubePlayerExample></YouTubePlayerExample>, []);

    //MAKING A CALL TO STORE WILL FORCE A RERENDER IN THE YOUTUBE API, WHICH IS NOT WHAT WE WANT BUT HOW 
    //CAN WE PREVENT THAT? 

    let homeElement = 
            <div id="playlister-list-selector">
            <div><AppBanner></AppBanner></div>
            <div id = "list-cards-section">
            <HomeIcon sx = {{p: 3, border: '2px solid', borderColor: 'black'}}></HomeIcon>
            <GroupsIcon sx = {{p: 3, border: '2px solid', borderColor: 'black'}}></GroupsIcon>
            <PersonIcon sx = {{p: 3, border: '2px solid', borderColor: 'black'}}></PersonIcon>
            <TextField sx ={{ml: 15, width: '60%', mt: 1}} id="outlined-basic" label="Search" variant="outlined" onKeyPress = {(event) => handleSearchPress(event)} onChange={(event) => handleSearchPlaylist(event.target.value)}></TextField>
            <SortIcon sx = {{ml: 15, mb: 3}}
                onClick = {handleTabs}
            ></SortIcon>
            <div id = "player-comments-tab">
            <Tabs value = {value} onChange = {handleTabs} sx ={{mb: 1}}>
                <Tab label = "Player"></Tab>
                <Tab label= "Comments"></Tab>
            </Tabs>
            <TabPanel value = {value} index = {0}>
            <Box sx={{width: '230px', height: '233px'}}></Box>
            </TabPanel>
            <TabPanel value = {value} index = {1}></TabPanel>
            </div>
            <Box id="list-selector-list" sx ={{width: '100%', mt: 8}}>
                {
                    listCard
                }
                <MUIDeleteModal />
            </Box>
            <div id = {value === 0 ? "add-list-bottom" : "add-list-bottom-comments"}>
            <Fab sx={{transform:"translate(805%, 0%)"}}
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                Your Playlists
            </div>
            </div>
        </div>
    
    if(store.currentList !== null) {
        homeElement = 
        <div id="playlister-list-selector">
            <div><AppBanner></AppBanner></div>
            <div id = "list-cards-section">
            <HomeIcon sx = {{p: 3, border: '2px solid', borderColor: 'black'}}></HomeIcon>
            <GroupsIcon sx = {{p: 3, border: '2px solid', borderColor: 'black'}}></GroupsIcon>
            <PersonIcon sx = {{p: 3, border: '2px solid', borderColor: 'black'}}></PersonIcon>
            <TextField sx ={{ml: 15, width: '60%', mt: 1}} id="outlined-basic" label="Search" variant="outlined" onKeyPress = {(event) => handleSearchPress(event)} onChange={(event) => handleSearchPlaylist(event.target.value)}></TextField>
            <SortIcon sx = {{ml: 15, mb: 3}}
                onClick = {handleTabs}
            ></SortIcon>
            <div id = "player-comments-tab">
            <Tabs value = {value} onChange = {handleTabs} sx ={{mb: 1}}>
                <Tab label = "Player"></Tab>
                <Tab label= "Comments"></Tab>
            </Tabs>
            <TabPanel value = {value} index = {0}><div id = "youtube-display"><Box id>{youtubePlayer}</Box></div>
            </TabPanel>
            <TabPanel value = {value} index = {1}><Box>
            
            {
                store.currentList.comments.map(comment => <Box  sx={{borderRadius:"12px", p: "20px", marginTop: '5px', display: 'flex', p: 1, bgcolor: '#8000F00F'}}>{comment.message}</Box>)
            }

            
            </Box><div id = "comment-field"><TextField sx={{mt: 40, width: '100%'}} onKeyPress={(store.currentList !== undefined) ? (event) => handleKeyPress(event, store.currentList._id) : ""} onChange={(event) => handleUpdateText(event.target.value)} id="outlined-basic" label="Add Comment" variant="outlined"></TextField></div></TabPanel>
            </div>
            <Box id="list-selector-list" sx ={{width: '100%', mt: 8}}>
                {
                    listCard
                }
                <MUIDeleteModal />
            </Box>
            <div id = {value === 0 ? "add-list-bottom" : "add-list-bottom-comments"}>
            <Fab sx={{transform:"translate(805%, 0%)"}}
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                Your Playlists
            </div>
            </div>
        </div>
    }

    if(store.isSearched === true) {
        console.log(playListInfo);
        homeElement = 
            <div id="playlister-list-selector">
            <div><AppBanner></AppBanner></div>
            <div id = "list-cards-section">
            <HomeIcon sx = {{p: 3, border: '2px solid', borderColor: 'black'}}></HomeIcon>
            <GroupsIcon sx = {{p: 3, border: '2px solid', borderColor: 'black'}}></GroupsIcon>
            <PersonIcon sx = {{p: 3, border: '2px solid', borderColor: 'black'}}></PersonIcon>
            <TextField sx ={{ml: 15, width: '60%', mt: 1}} id="outlined-basic" label="Search" variant="outlined" onKeyPress = {(event) => handleSearchPress(event)} onChange={(event) => handleSearchPlaylist(event.target.value)}></TextField>
            <SortIcon sx = {{ml: 15, mb: 3}}
                onClick = {handleTabs}
            ></SortIcon>
            <div id = "player-comments-tab">
            <Tabs value = {value} onChange = {handleTabs} sx ={{mb: 1}}>
                <Tab label = "Player"></Tab>
                <Tab label= "Comments"></Tab>
            </Tabs>
            <TabPanel value = {value} index = {0}>
            <Box sx={{width: '230px', height: '233px'}}></Box>
            </TabPanel>
            <TabPanel value = {value} index = {1}></TabPanel>
            </div>
            <Box id="list-selector-list" sx ={{width: '100%', mt: 8}}>
                {
                   listCard
                }
                <MUIDeleteModal />
            </Box>
            <div id = {value === 0 ? "add-list-bottom" : "add-list-bottom-comments"}>
            <Fab sx={{transform:"translate(805%, 0%)"}}
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                Your Playlists
            </div>
            </div>
        </div>
    }

    return (
        homeElement
    );
}

export default HomeScreen;