import { useContext, useRef, useEffect, useState } from 'react';
import Head from 'next/head'
import { PlayerContext, userPlayer } from '../../contexts/PlayerContext';
import styles from  './styles.module.scss';
import Image from 'next/image'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { converDurationToTimeString } from '../../utils/convertDurationToTimeString';



export function Player() {

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isShuffling,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        toggleShuffle,
        clearPlayerState
    } = userPlayer();


    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgess] = useState(0);


    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgess(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount : number){
        audioRef.current.currentTime = amount;
        setProgess(amount)
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        } else {
            clearPlayerState()
        }
    }




    

    useEffect(() => {
       if(!audioRef.current){
           return;
       }


       if(isPlaying){
           audioRef.current.play();
       } else {
           audioRef.current.pause();
       }

    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return(

        <div className={styles.playerContainer}>

            <Head>
                <title>Home | Podcastr </title>
            </Head>

            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            {  episode ? (
                <div className={styles.currentEpisode}>
                    
                 <Image 
                 width={592}
                 height={592} 
                 src={episode.thumbnail} 
                 objectFit='cover'  
                 />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>

                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                <strong>Selecione um podcasta para ouvir</strong>
            </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                <span>{converDurationToTimeString(progress)}</span>
                <div className={styles.slider}>

                {

                    episode ? (
                        <Slider
                        max={episode.duration}
                        value={progress}
                        trackStyle={{ backgroundColor : '#04d361'}}
                        railStyle={{backgroundColor : '#9f75ff'}}
                        onChange={handleSeek}
                         />
                    )  : (
                        <div className={styles.emptySlider}></div>
                    )
                }
                </div>
                <span>{converDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                    { episode && (
                        <audio src={episode.url}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        loop={isLooping}
                        onLoadedMetadata={setupProgressListener}
                        > </audio>
                    ) }

                <div className={styles.buttons}>
                    <button
                    type="button" 
                    disabled={!episode || episodeList.length === 1}
                    onClick={toggleShuffle}
                    className={isShuffling ? styles.isActive : ''}
                     >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button 
                    type="button" 
                    className={styles.playButton}
                    disabled={!episode}
                    onClick={togglePlay}
                    >
                        { isPlaying ?
                        <img src="/pause.svg" alt="Tocar"/> :
                        <img src="/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button
                    type="button"
                    disabled={!episode}
                    onClick={toggleLoop}
                    className={isLooping ? styles.isActive : ''}
                      >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>

                </div>
            </footer>
            
        </div>

    );
} 