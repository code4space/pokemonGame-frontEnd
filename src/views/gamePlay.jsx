import { useEffect, useState } from 'react'
import '../assets/css/gamePlay.css'
import shadow from '../assets/icon/shadow.png'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { clickSound1, deathSound, hitSound } from '../components/playSound'
import axios from 'axios'
import { baseUrl } from '../constant/url'
import LoadingScreen from '../components/loading'
import { damageDealt } from '../constant/helper'
import bookIcon from '../assets/icon/book.png'
import InstructionPage from '../components/instruction'

export default function GamePlayPage() {

    // game state
    const [turn, setTurn] = useState(0)
    const [isMyTurn, setIsMyTurn] = useState(true)
    const [enemies, setEnemies] = useState(false)
    const [attackMenu, setAttackMenu] = useState(false)
    const [remainingHP, setRemainingHP] = useState([])
    const [myDeck, setMyDeck] = useState([])
    const [instruction, setInstruction] = useState(false)
    
    // set useEffect (if clear the function will run normally)
    const [clear, setClear] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // effect
    const [targetEffect, setTargetEffetct] = useState(false)
    const [hitEffect, setHitEffect] = useState(false)
    const [damage, setDamage] = useState({ total: 0, effectiveness: 'Normal' })

    const navigate = useNavigate()


    const difficulty = useSelector((state) => {
        return state.UserReducer.isHard
    })

    const lose = async () => {
        let state = { isLose: true, difficulty };
        if (difficulty) {
            const deletedPokemon = deck[Math.floor(Math.random() * 3)]
            if (!state['pokemon']) state['pokemon'] = deletedPokemon.name 
            await axios({
                url: baseUrl + `/pokemon/${deletedPokemon.id}`,
                method: 'DELETE',
                headers: { access_token: localStorage.getItem('access_token') },
                data: {
                    listBall: [
                        { ball: 'pokeball', increase: difficulty ? 3 : 5 },
                        { ball: 'greatball', increase: difficulty ? 4 : 3 },
                        { ball: 'ultraball', increase: difficulty ? 2 : 1 },
                        { ball: 'masterball', increase: difficulty ? 1 : 0 },
                    ]
                }
            });
        }
        navigate('/play/lose', { state });
    };

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

    function attackingTarget(target) {
        setAttackMenu(false)
        hitSound()
        setTargetEffetct(target)
        setHitEffect(true);
        const dd = damageDealt(myDeck[turn]?.attack, enemies[target].def, myDeck[turn].power, enemies[target].type, myDeck[turn].type)
        setDamage({ ...damage, total: dd.damage, effectiveness: dd.status })

        const timer = setTimeout(async () => {
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
                if (tempEnemy.length < 1) {
                    try {
                        const id = deck.map(el => el.id);

                        await axios({
                            url: baseUrl + '/pokemon/levelup',
                            method: 'PATCH',
                            headers: { access_token: localStorage.getItem('access_token') },
                            data: { pokemonId: id, upLevel: difficulty ? 2 : 1 }
                        });

                        await axios({
                            url: baseUrl + '/pokeball/increase',
                            method: 'PATCH',
                            headers: { access_token: localStorage.getItem('access_token') },
                            data: {
                                listBall: [
                                    { ball: 'pokeball', increase: difficulty ? 3 : 5 },
                                    { ball: 'greatball', increase: difficulty ? 4 : 3 },
                                    { ball: 'ultraball', increase: difficulty ? 2 : 1 },
                                    { ball: 'masterball', increase: difficulty ? 1 : 0 },
                                ]
                            }
                        });

                        await axios({
                            url: baseUrl + `/draw/increase/${difficulty ? 7 : 4}`,
                            method: 'PATCH',
                            headers: { access_token: localStorage.getItem('access_token') }
                        });

                        const state = { isWin: true, difficulty };
                        navigate('/play/win', { state });
                    } catch (err) {
                        console.log(err);
                    }
                }
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
        if (!myDeck[0]) return lose()
        const temp = [...remainingHP]
        const dd = damageDealt(enemies[index - myDeck.length]?.attack, myDeck[0]?.def, enemies[index - myDeck.length]?.power, myDeck[0]?.type, enemies[index - myDeck.length]?.type)
        temp[0] -= dd.damage
        console.log(dd)
        let tempDeck = [...myDeck]
        setDamage({ ...damage, total: dd.damage, effectiveness: dd.status })

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
            return setIsMyTurn(false)
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
            enemyTurn(turn);
        }
    }, [turn, enemies, myDeck]);

    function handleButtonInstruction () {
        setInstruction(!instruction)
    }

    if (isLoading) return <LoadingScreen />
    else {
        if (!deck.length) {
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
                                        {((hitEffect && isMyTurn) && targetEffect === i) && <h5><b style={damage.effectiveness === 'Normal' ? { color: 'rgb(93, 216, 77)' } : damage.effectiveness === 'Effective' ? { color: 'rgb(216, 77, 77)' } : damage.effectiveness === 'Ineffective' ? { color: 'rgb(216, 214, 77)' } : { color: 'white' }}>{damage.effectiveness}</b> {damage.total}</h5>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='pokemon-place'>
                        <img src={shadow} alt="pokemon-shadow" className='shadow' />
                        <div className='pokemon-char'>
                            {myDeck.map((el, i) => {
                                return (
                                    <div className='pokemon-img-ctrl' key={i}>
                                        <img src={el.backView} alt="" style={((hitEffect && !isMyTurn) && i === 0) ? { animation: 'shake1 2s linear 0s infinite, hitEffect1 2s linear 0s infinite' } : null} />
                                        <span>Hp. <span className='hp' style={{ background: `linear-gradient(90deg, rgb(250, 9, 69) 0%, rgb(250, 9, 69) ${(remainingHP[i] / el.hp) * 100}%, rgba(255,255,255,1) ${(remainingHP[i] / el.hp) * 100}%)` }}></span></span>
                                        <div>{el.name}</div>
                                        {((hitEffect && !isMyTurn) && 0 === i) && console.log(damage)}
                                        {((hitEffect && !isMyTurn) && 0 === i) && <h5><b style={damage.effectiveness === 'Normal' ? { color: 'rgb(93, 216, 77)' } : damage.effectiveness === 'Effective' ? { color: 'rgb(216, 77, 77)' } : damage.effectiveness === 'Ineffective' ? { color: 'rgb(216, 214, 77)' } : { color: 'white' }}>{damage.effectiveness}</b> {damage.total}</h5>}
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
                                                                return <span key={el.id} onClick={() => attackingTarget(i)}>* Lv. {el?.level} {el.name} [{el.type.elements.join(', ')}]</span>
                                                            })}
                                                                <span onClick={back} style={{ marginTop: '20px' }}>* Back</span></>
                                                            :
                                                            <><span onClick={handleButtonAttack}>* Attack</span>
                                                                <span onClick={() => { handleButtonDef(myDeck[turn].name) }}>* Def</span></>}
                                                    </div>
                                                </>
                                            :
                                            <>
                                                <p>ENEMY turn</p>
                                                <div className='turn-opt'>
                                                    <span>{enemies[turn - myDeck.length].name} attacking...</span>
                                                </div>
                                            </>
                                    }
                                    <div className='book' onClick={handleButtonInstruction}><img src={bookIcon} alt="book"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                {instruction && <InstructionPage close={handleButtonInstruction}/>}
            </>
        )
    }
}