import clickTone from '../assets/sound/click-tone.wav'
import pokemonTheme1 from '../assets/sound/pokemon-theme.mp3'
import pokemonTheme2 from '../assets/sound/pokemon-theme1.mp3'
import { useRef, useEffect, useState } from 'react'

export const clickSound = () => {
    const audio = new Audio(clickTone)
    audio.play()
}

export const PokemonTheme1 = (volume = 0.09) => {
    const audioRef = useRef(null);
    // Set the volume to 50% when the component mounts
    useEffect(() => {
        audioRef.current.volume = volume;
    }, []);

    return (
        <audio ref={audioRef} autoPlay loop>
            <source src={pokemonTheme1} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    )
}

export const PokemonTheme2 = (volume = 0.09, playState) => {
    const audioRef = useRef(null);
    // Set the volume to 50% when the component mounts
    useEffect(() => {
        audioRef.current.volume = volume;
    }, []);

    useEffect(() => {
        if (playState) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [playState]);

    return (
        <audio ref={audioRef} autoPlay loop>
            <source src={pokemonTheme2} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    )
}