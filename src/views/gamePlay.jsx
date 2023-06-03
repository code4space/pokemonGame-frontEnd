import { useEffect, useState } from 'react'
import '../assets/css/gamePlay.css'
import shadow from '../assets/icon/shadow.png'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { clickSound1, deathSound, hitSound } from '../components/playSound'
import axios from 'axios'
import { baseUrl } from '../constant/url'
import LoadingScreen from '../components/loading'
import Swal from 'sweetalert2'
import { damageDealt } from '../constant/helper'

export default function GamePlayPage() {
    const [turn, setTurn] = useState(0)
    const [isMyTurn, setIsMyTurn] = useState(true)
    const [enemies, setEnemies] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [attackMenu, setAttackMenu] = useState(false)
    const [remainingHP, setRemainingHP] = useState([])
    const [myDeck, setMyDeck] = useState([])
    const [clear, setClear] = useState(false)

    // effect
    const [targetEffect, setTargetEffetct] = useState(false)
    const [hitEffect, setHitEffect] = useState(false)
    const [damage, setDamage] = useState(0)
    const [effectiveness, setEffectiveness] = useState('normal')


    const difficulty = useSelector((state) => {
        return state.UserReducer.isHard
    })

    const deck = useSelector((state) => {
        return state.UserReducer.deck
    })


    function renderStripes() {
        const height = [10, 8, 6, 4, 2, 0.1]
        return (
            height.map((el, i) => {
                return (
                    <span key={i} style={{ height: `${el}px` }}></span>
                )
            })
        )
    }

    function handleButtonAttack() {
        clickSound1()
        setAttackMenu(true)

    }

    // function win () {
    //     Swal
    // }

    function attackingTarget(target) {
        setAttackMenu(false)
        hitSound()
        setTargetEffetct(target)
        setHitEffect(true);
        const dd = damageDealt(myDeck[turn]?.attack, enemies[target].def, myDeck[turn].power, enemies[target].type, myDeck[turn].type)
        setDamage(dd.damage)
        setEffectiveness(dd.status)

        const timer = setTimeout(() => {
            setHitEffect(false);
            const temp = [...remainingHP]
            temp[target + myDeck.length] -= dd.damage

            if (temp[target + myDeck.length] <= 0) {
                deathSound()
                let tempEnemy = [...enemies]
                tempEnemy.splice(target, 1)
                setEnemies(tempEnemy)
                temp.splice(target + myDeck.length, 1)
                setRemainingHP(temp)
                if (tempEnemy.length < 1) return console.log('you WIN')
            } else {
                setRemainingHP(temp)
            }

            if (turn + 1 === myDeck.length) {
                setTurn(turn + 1)
                return setIsMyTurn(false)
            }

            return setTurn(turn + 1)
        }, 800);

        return () => clearTimeout(timer);
    }

    function enemyTurn(index) {
        if (!myDeck[0]) return console.log('YOU LOSEEE')

        const temp = [...remainingHP]
        const dd = damageDealt(enemies[index - myDeck.length]?.attack, myDeck[0]?.def, enemies[index - myDeck.length]?.power, myDeck[0]?.type, enemies[index - myDeck.length]?.type)
        temp[0] -= dd.damage
        let tempDeck = [...myDeck]
        setDamage(dd.damage)
        setEffectiveness(dd.status)

        hitSound()
        setTargetEffetct(0)
        setHitEffect(true);

        const timer = setTimeout(() => {
            setHitEffect(false);
            if (temp[0] <= 0) {
                deathSound()
                tempDeck.splice(0, 1)
                temp.splice(0, 1)
                setMyDeck(tempDeck)

                if (!enemies[index - tempDeck.length]) {
                    setTurn(0)
                    setRemainingHP(temp)
                    return setIsMyTurn(true)
                }
                return setRemainingHP(temp)
            } else {
                setRemainingHP(temp)
            }

            if (turn + 1 === myDeck.length + enemies.length) {
                setTurn(0)
                return setIsMyTurn(true)
            }

            return setTurn(turn + 1)
        }, 2000)

        return () => clearTimeout(timer);
    }

    function handleButtonDef(name) {
        clickSound1()

        if (turn + 1 === myDeck.length) {
            setTurn(turn + 1)
            setIsMyTurn(false)
        }

        return setTurn(turn + 1)
    }

    function back() {
        clickSound1()
        setAttackMenu(false)
    }

    function fetchRemainingHp(enemies) {
        if (remainingHP.length) return null
        else {
            let temp = []
            deck.forEach(el => {
                temp.push(el.hp)
            })
            enemies.forEach(el => {
                temp.push(el.hp)
            })
            setRemainingHP(temp)
        }
    }

    useEffect(() => {
        console.log(difficulty)
        axios({
            url: baseUrl + `/pokemon/enemies/${difficulty}`,
            method: "GET",
            headers: { access_token: localStorage.getItem('access_token') },
        }).then((res) => {
            const temp = [...deck]
            setMyDeck(temp)
            setEnemies(res.data.pokemon)
            setIsLoading(false)
            fetchRemainingHp(res.data.pokemon)
            setClear(true)
        }).catch(error => {
            console.log(error);
        });
    }, [])


    useEffect(() => {
        if (turn >= myDeck.length && clear) {
            console.log(turn, 'masuk', myDeck)
            enemyTurn(turn);
        }
    }, [turn, enemies, myDeck]);

    if (isLoading) return <LoadingScreen />
    else {

        if (!myDeck.length) {
            return <Navigate to={'/prepare'}></Navigate>;
        }
        return (
            <>
                <div className="play-bg">
                    <div className='play-bg-stripes'>
                        <div>
                            {renderStripes()}
                        </div>
                    </div>

                    <div className='pokemon-place enemy'>
                        <img src={shadow} alt="pokemon-shadow" className='shadow' />
                        <div className='pokemon-char'>
                            {enemies.map((el, i) => {
                                return (
                                    <div className='pokemon-img-ctrl' key={i}>
                                        <img src={el.frontView} alt="" style={((hitEffect && isMyTurn) && targetEffect === i) ? { animation: 'shake 0.4s linear 0s, hitEffect 1s linear 0s' } : null} />
                                        <span>Hp. <span className='hp' style={{ background: `linear-gradient(90deg, rgb(250, 9, 69) 0%, rgb(250, 9, 69) ${(remainingHP[i + myDeck.length] / el.hp) * 100}%, rgba(255,255,255,1) ${(remainingHP[i + myDeck.length] / el.hp) * 100}%)` }}></span></span>
                                        <div>{el.name}</div>
                                        {((hitEffect && isMyTurn) && targetEffect === i) && <h5><b style={effectiveness === 'Normal' ? { color: 'rgb(93, 216, 77)' } : effectiveness === 'Effective' ? { color: 'rgb(216, 77, 77)' } : effectiveness === 'Ineffective' ? {color: 'rgb(216, 214, 77)'} : {color: 'white'}}>{effectiveness}</b> {damage}</h5>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='pokemon-place'>
                        <img src={shadow} alt="pokemon-shadow" className='shadow' />
                        <div className='pokemon-char'>
                            {myDeck.map((el, i) => {
                                console.log(targetEffect, i)
                                return (
                                    <div className='pokemon-img-ctrl' key={i}>
                                        <img src={el.backView} alt="" style={((hitEffect && !isMyTurn) && i === 0) ? { animation: 'shake1 2s linear 0s infinite, hitEffect1 2s linear 0s infinite' } : null} />
                                        <span>Hp. <span className='hp' style={{ background: `linear-gradient(90deg, rgb(250, 9, 69) 0%, rgb(250, 9, 69) ${(remainingHP[i] / el.hp) * 100}%, rgba(255,255,255,1) ${(remainingHP[i] / el.hp) * 100}%)` }}></span></span>
                                        <div>{el.name}</div>
                                        {((hitEffect && !isMyTurn) && 0 === i) && <h5><b style={effectiveness === 'Normal' ? { color: 'rgb(93, 216, 77)' } : effectiveness === 'Effective' ? { color: 'rgb(216, 77, 77)' } : effectiveness === 'Ineffective' ? {color: 'rgb(216, 214, 77)'} : {color: 'white'}}>{effectiveness}</b> {damage}</h5>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className='dialogue-container'>
                    <div className='dialogue-border'>
                        <div className='dialogue-border1'>
                            <div className='dialogue-border2'>
                                <div className='dialogue-border3'>
                                    {
                                        isMyTurn ?
                                            hitEffect ?
                                                <>
                                                    <p>Lv.{myDeck[turn]?.level} {myDeck[turn]?.name.toUpperCase()} Turn</p>
                                                    <div className='turn-opt'>
                                                        <span style={{ marginTop: '20px' }}>...Action</span>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <p>Lv.{myDeck[turn]?.level} {myDeck[turn]?.name.toUpperCase()} Turn</p>
                                                    <div className='turn-opt'>
                                                        {attackMenu ?
                                                            <>{enemies.map((el, i) => {
                                                                return <span key={el.id} onClick={() => attackingTarget(i)}>*Lv. {el?.level} {el.name} [{el.type.elements.join(', ')}]</span>
                                                            })}
                                                                <span onClick={back} style={{ marginTop: '20px' }}>* Back</span></>
                                                            :
                                                            <><span onClick={handleButtonAttack}>* Attack</span>
                                                                <span onClick={() => { handleButtonDef(myDeck[turn].name) }}>* Def</span></>}
                                                    </div>
                                                </>
                                            :
                                            <p>ENEMY turn</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </>
        )
    }
}