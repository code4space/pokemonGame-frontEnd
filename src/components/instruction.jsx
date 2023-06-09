

export default function InstructionPage({ close, sight, pokemon }) {
    console.log(pokemon)
    if (sight) return (
        <div className="nav-opt">
            <div className="nav-bg" onClick={close}></div>
            <div className="nav-content pixelated-border" style={{ width: "80%", height: "70%", padding: '10px' }}>
                <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                    <h2 style={{marginBottom: '30px'}}>Lv.{pokemon.level} {pokemon.name}</h2>
                    <p><b>Attack :</b> {pokemon.attack}</p>
                    <p><b>HP :</b> {pokemon.hp}</p>
                    <p><b>Def :</b> {pokemon.def}</p>
                    <p><b>element :</b> {pokemon.type.elements.join(',')}</p>
                    <p><b>weakness :</b> {pokemon.type.weakness.join(',')}</p>
                    <p><b>immune :</b> {pokemon.type.immune.length > 0 ? pokemon.type.immune.join(',') : 'none'}</p>
                </div>
            </div>
        </div>
    )

    else return (
        <div className="nav-opt">
            <div className="nav-bg" onClick={close}></div>
            <div className="nav-content pixelated-border" style={{ width: "80%", height: "70%", padding: '10px' }}>
                <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                    <p><b>Attack :</b> Your pokemon will attacking the target you choose</p>
                    <p><b>Def :</b> Your Pokemon will gain a barrier based on its Defense and HP percentage.</p>
                    <p><b>Sight :</b> Check your opponent's stats.</p>
                    <p style={{ margin: 0 }}><b>Damage Dealt :</b></p>
                    <p style={{ marginLeft: '10px' }}>
                        * normal: just normal Damage<br />
                        * Effective: The damage are doubled<br />
                        * Ineffective: The damage are halved<br />
                        * immune: The damage will be 0
                    </p>
                    <p style={{ textAlign: 'center' }}><i>-- Elements effect the damage dealt --</i></p>
                    <p>
                        <b>Normal:</b> weak to Fighting <br />
                        <b>Fire:</b> weak to Water, Ground, Rock<br />
                        <b>Water:</b> weak to Grass, Electric<br />
                        <b>Grass:</b> weak to Fire, Ice, Poison, Flying, Bug<br />
                        <b>Electric:</b> weak to Ground<br />
                        <b>Ice:</b> weak to Fire, Fighting, Rock, Steel<br />
                        <b>Fighting:</b> weak to Flying, Psychic, Fairy<br />
                        <b>Poison:</b> weak to Ground, Psychic<br />
                        <b>Ground:</b> weak to Water, Grass, Ice<br />
                        <b>Flying:</b> weak to Electric, Ice, Rock<br />
                        <b>Psychic:</b> weak to Bug, Ghost, Dark<br />
                        <b>Bug:</b> weak to Flying, Rock, Fire<br />
                        <b>Rock:</b> weak to Water, Grass, Fighting, Ground, Steel<br />
                        <b>Ghost:</b> weak to Ghost, Dark<br />
                        <b>Dragon:</b> weak to Ice, Dragon, Fairy<br />
                        <b>Dark:</b> weak to Fighting, Bug, Fairy<br />
                        <b>Steel:</b> weak to Fire, Fighting, Ground<br />
                        <b>Fairy:</b> weak to Poison, Steel<br />
                    </p>
                </div>
            </div>
        </div>
    )
}