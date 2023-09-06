import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PokemonTheme2 as pokemonTheme2, clickSound, battleSound } from "./playSound";
import Swal from "sweetalert2";
import { connect } from 'react-redux';
import { setIsHard } from "../store/actions/setGameSettings";

const PokemonTheme2 = ({ activeMusic }) => {
    return (
        pokemonTheme2(activeMusic)
    );

};

const BattleTheme = ({ activeMusic }) => {
    return (
        battleSound(activeMusic)
    );

};

function TopNavbar({ isHard, setIsHard }) {
    const [activeMusic, setActiveMusic] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [activeNavbar, setActiveNavbar] = useState(false);
    const [activeCredit, setActiveCredit] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    function musicButton() {
        setActiveMusic(!activeMusic);
    }

    function logout() {
        clickSound();
        localStorage.clear();
        navigate('/login');
    }

    function handleButtonCredit() {
        clickSound()
        setActiveCredit(!activeCredit)
        setActiveNavbar(false)
    }

    function navbar() {
        clickSound();
        setActiveNavbar(!activeNavbar)
    }

    function back() {
        clickSound();
        navigate('/');
    }

    useEffect(() => {
        // Update the screen width whenever the window is resized
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function difficulty() {
        clickSound();
        if (!isHard) {
            Swal.fire({
                title: 'Change to Extreme difficulty?',
                html: "<p class='html-text'>You will get more loot, but losing the game will make one of your pokemon disappear</p>",
                showCancelButton: true,
                cancelButtonText: "No, I'm weak",
                confirmButtonText: 'Yes',
                confirmButtonColor: '#d33',
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    setIsHard(true);
                }
            });
        } else {
            setIsHard(false);
        }
    }

    return (
        <>
            { (location.pathname !== '/play/lose' && location.pathname !== '/play/win') && (location.pathname !== '/play' ? <PokemonTheme2 activeMusic={activeMusic} /> : <BattleTheme activeMusic={activeMusic} />)}
            <div className="top-icon-left">
                {location.pathname !== '/' ? <button className="back" onClick={back}>Back</button> : <button className="back difficulty" onClick={difficulty} style={isHard ? { animation: 'outer-glow 3s infinite', backgroundColor: 'rgb(245, 48, 48)' } : { backgroundColor: 'rgb(72, 236, 81)' }}>DIFFICULTY</button>}
            </div>
            {activeCredit && <div className="nav-opt">
                <div className="nav-bg" onClick={handleButtonCredit}></div>
                <div className="nav-content pixelated-border" style={{ maxWidth: '80vw', padding: '20px', height: '70dvh', maxHeight: '60dvh' }}>
                    <div style={{ overflowY: 'auto', height: '100%', width: '100%', padding: '5px' }}>
                        <h2 style={{ marginBottom: '10px' }}>CREDITS</h2>
                        <p style={{ textAlign: 'center', marginBottom: '40px' }}>Thank you for trying my game! It was a personal project I completed in two weeks. While I've tried my best to fix any bugs, please
                            let me know if you encounter any issues or have suggestions. I'll share it on GitHub soon. Your support means a lot.</p>
                        <p><b>* Disclaimer:</b> No profits are generated from this project, and all intellectual property rights and ownership of the Pokémon TCG remain with the respective owners.</p>
                        <p style={{ paddingBottom: '30px' }}><b>* Song: <br /></b> &#9836; Hyper Potions - Littleroot Town <br />&#9836; Pokemon song - Littleroot Town</p>
                        <p style={{ textAlign: 'center' }} className="copyright">William 2023 | Designed and Created by William</p>
                    </div>
                </div>
            </div>}
            {isMobile ?
                <>
                    <div className="top-icon-right">
                        <button className="navbar" onClick={navbar}>&#9776;</button>
                    </div>
                    {activeNavbar && <div className="nav-opt">
                        <div className="nav-bg" onClick={() => setActiveNavbar(false)}></div>
                        <div className="nav-content pixelated-border">
                            <button className="logout credit" onClick={() => handleButtonCredit()}>Credits</button>
                            <button className="logout" style={{ width: '100%' }} onClick={logout}>Logout</button>
                            <div className="lower-button"><button className={activeMusic ? "music-icon music-active" : "music-icon"} style={{ margin: 0 }} onClick={musicButton}>&#9835;</button>
                                <button className="navbar" onClick={navbar}>X</button></div>
                        </div>
                    </div>}
                </>
                :
                <>
                    {location.pathname === '/' && <span onClick={handleButtonCredit} className="credit-bottom">Credits</span>}
                    <div className="top-icon-right">
                    <button className={activeMusic ? "music-icon music-active" : "music-icon"} onClick={musicButton}>Music</button>
                        <button className="logout" onClick={logout}>Logout</button>
                    </div>
                </>
            }
            <Outlet />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isHard: state.UserReducer.isHard,
    };
};

const mapDispatchToProps = {
    setIsHard,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNavbar);
