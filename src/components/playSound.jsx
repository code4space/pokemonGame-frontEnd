import gameNotification from '../assets/sound/game-notification.wav'
import clickTone from '../assets/sound/click-tone.wav'
import jumpCoin from '../assets/sound/jump-coin.wav'
import pokemonTheme1 from '../assets/sound/pokemon-theme.mp3'
import pokemonTheme2 from '../assets/sound/pokemon-theme1.mp3'
import battleMusic from '../assets/sound/battle-music.mp3'
import gameOver from '../assets/sound/game-over.wav'
import hit_sound from '../assets/sound/hit-sound.mp3'
import lose_sound from '../assets/sound/lose-sound.mp3'
import win_sound from '../assets/sound/win-sound.mp3'

import ReactAudioPlayer from 'react-audio-player';

export const clickSound = () => {
    const audio = new Audio(clickTone);
    audio.play();
};

export const clickSound1 = () => {
    const audio = new Audio(jumpCoin);
    audio.play();
};

export const gameNotificationSound = () => {
    const audio = new Audio(gameNotification);
    audio.volume = 0.4;
    audio.play();
};

export const deathSound = () => {
    const audio = new Audio(gameOver);
    audio.volume = 0.4;
    audio.play();
};

export const hitSound = () => {
    const audio = new Audio(hit_sound);
    audio.volume = 0.4;
    audio.play();
};

export const winSound = () => {
    const audio = new Audio(win_sound);
    audio.volume = 0.4;
    audio.play();
};

export const loseSound = () => {
    const audio = new Audio(lose_sound);
    audio.volume = 0.4;
    audio.play();
};

export const PokemonTheme1 = () => {
    const volume = 0.09
    return <ReactAudioPlayer src={pokemonTheme1} autoPlay loop volume={volume} />
};

export const PokemonTheme2 = (playState) => {
    const volume = 0.09
    return <ReactAudioPlayer src={pokemonTheme2} autoPlay loop volume={volume} muted={!playState}/>
};

export const battleSound = (playState) => {
    const volume = 0.09
    return <ReactAudioPlayer src={battleMusic} autoPlay loop volume={volume} muted={!playState} />
};