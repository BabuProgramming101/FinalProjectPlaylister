import { Link } from 'react-router-dom'


export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <span>Playlister</span>
            <br></br>
            <div id ="splash-screen-span"><span>Welcome To The Playlister!</span></div>
            <div id ="splash-screen-playlist-about"><br></br><span>From Editing, to Adding, to Creating Playlists, the Playlister allows you to do so much more!</span></div>
            <div>
                <button className='create-account'> <Link style={{ textDecoration: 'none', color: 'white' }} to='/register/'>Create Account</Link></button>
                <button className='login'> <Link style={{ textDecoration: 'none', color: 'white' }} to='/login/'>Login</Link></button>
                <button className='guest'> <Link style={{ textDecoration: 'none', color: 'white' }} to='/'>Continue As Guest</Link></button> 
            </div>
            <div id = "playlist-creator">By: Baybhin Gurung</div>
        </div>
    )
}