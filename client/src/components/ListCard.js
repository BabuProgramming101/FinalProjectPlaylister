import { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected, userFirst, userLast, listenNumber } = props;
    const [style, setStyle] = useState("normalList");

    function handleLoadList(event, id) {
        event.stopPropagation();
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
            console.log(store.currentList);
        }
    }

    function handleAddNewSong() {
        store.addNewSong();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    async function handleDuplicateList(event, id) {
        event.stopPropagation();
        console.log(id);
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDuplicate(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function collapse(event) {
        event.stopPropagation();
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentBooleanToTrue();
        }
    }


    function handleListBoolean(event, id) {
        event.stopPropagation();
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentListHighlighted(id);
        }
    }

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }


    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
   
    let cardElement =
        <div className= {store.currentBoolean === true && idNamePair._id === store.currentList._id ? "highlightedList" : "normalList"}>
        {modalJSX}
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{borderRadius:"12px", p: "20px", marginTop: '5px', display: 'flex', p: 1 }}
            style={{transform:"translate(1%,0%)", width: '98%', fontSize: '32pt' }}
            button
            onClick={(event) => handleListBoolean(event, idNamePair._id)}
        > 
            <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}
            <div id = "playlister-username">By: <span id = "user-info">{userFirst}{userLast}</span></div>
            <div id = "published-name">Published:<span id = "listens-number">Listens: <span id = "listen-amount">{listenNumber}</span></span></div>
            <ExpandMoreIcon sx = {{ml: 70}}
            onClick = {(event) => handleLoadList(event, idNamePair._id)}
            >
            </ExpandMoreIcon>
            </Box>
        </ListItem>
        </div>
    
    if(store.currentList !== null && idNamePair._id === store.currentList._id && store.currentBoolean === false) {
        cardElement = 
        <div className = {style}>
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{borderRadius:"12px", p: "20px", bgcolor: '#b8b808', marginTop: '5px', display: 'flex', p: 1 }}
            style={{transform:"translate(1%,0%)", width: '98%', fontSize: '32pt' }}
            button  
        >   
            <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}
            <div id = "playlister-username">By: <span id = "user-info">{userFirst}{userLast}</span></div>
            <div id = "handle-icon-button">
            <Box>
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))  
            } 
            <div id ="add-song-button"><Box
            sx={{borderRadius:"12px", p: "23px", marginTop: '2px', display: 'flex', p: 2, bgcolor: '#8000F00F'}}
            ><span id ="plus-symbol"><AddIcon
            onClick = {handleAddNewSong}></AddIcon></span></Box></div>
            </Box>
            <Box>
                <span>
                    <Button
                    onClick = {handleUndo}>
                    Undo</Button>
                    <Button
                    onClick = {handleRedo}>
                    Redo</Button>
                </span>
                <span id ="buttons">
                <Button
                >Publish</Button>
                <Button
                onClick = {(event) => {handleDeleteList(event, idNamePair._id)}}
                >Delete</Button>
                <Button
                onClick = {(event) => {handleDuplicateList(event, idNamePair._id)}}
                >Duplicate</Button>
                </span>
            </Box>
            <ExpandLessIcon sx = {{ml: 70, mt: 2}}
                onClick = {(event) => collapse(event, idNamePair._id)}
            > 
            </ExpandLessIcon>
            <div id = "published-name">Published:<span id = "listens-number">Listens:{listenNumber}</span></div>
            </div>
            </Box>
        </ListItem>
        </div>
    }
   

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;