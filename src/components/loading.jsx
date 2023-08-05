import runningPikachu from '../assets/icon/runningPikachu.gif'

export default function LoadingScreen({ find = false }) {
    if (find) return (
        <div className="lobby loading find">
            <h1>Find Oppenent</h1>
            <svg width="116" height="29" viewBox="0 0 116 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="dots">
                    <g id="dot3" style={{ '--delay': '0' }}>
                        <mask id="path-1-inside-1_12_2" fill="white">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M37 7H46V10H49V19H46V22H37V19H34V10H37V7Z" />
                        </mask>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M37 7H46V10H49V19H46V22H37V19H34V10H37V7Z" fill="#F7E901" />
                        <path d="M46 7H48V5H46V7ZM37 7V5H35V7H37ZM46 10H44V12H46V10ZM49 10H51V8H49V10ZM49 19V21H51V19H49ZM46 19V17H44V19H46ZM46 22V24H48V22H46ZM37 22H35V24H37V22ZM37 19H39V17H37V19ZM34 19H32V21H34V19ZM34 10V8H32V10H34ZM37 10V12H39V10H37ZM46 5H37V9H46V5ZM48 10V7H44V10H48ZM49 8H46V12H49V8ZM51 19V10H47V19H51ZM46 21H49V17H46V21ZM48 22V19H44V22H48ZM37 24H46V20H37V24ZM35 19V22H39V19H35ZM34 21H37V17H34V21ZM32 10V19H36V10H32ZM37 8H34V12H37V8ZM35 7V10H39V7H35Z" fill="#7E5701" mask="url(#path-1-inside-1_12_2)" />
                    </g>
                    <g id="dot2" style={{ '--delay': '6' }}>
                        <mask id="path-3-inside-2_12_2" fill="white">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M54 7H63V10H66V19H63V22H54V19H51V10H54V7Z" />
                        </mask>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M54 7H63V10H66V19H63V22H54V19H51V10H54V7Z" fill="#F7E901" />
                        <path d="M63 7H65V5H63V7ZM54 7V5H52V7H54ZM63 10H61V12H63V10ZM66 10H68V8H66V10ZM66 19V21H68V19H66ZM63 19V17H61V19H63ZM63 22V24H65V22H63ZM54 22H52V24H54V22ZM54 19H56V17H54V19ZM51 19H49V21H51V19ZM51 10V8H49V10H51ZM54 10V12H56V10H54ZM63 5H54V9H63V5ZM65 10V7H61V10H65ZM66 8H63V12H66V8ZM68 19V10H64V19H68ZM63 21H66V17H63V21ZM65 22V19H61V22H65ZM54 24H63V20H54V24ZM52 19V22H56V19H52ZM51 21H54V17H51V21ZM49 10V19H53V10H49ZM54 8H51V12H54V8ZM52 7V10H56V7H52Z" fill="#7E5701" mask="url(#path-3-inside-2_12_2)" />
                    </g>
                    <g id="dot1" style={{ '--delay': '12' }}>
                        <mask id="path-5-inside-3_12_2" fill="white">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M71 7H80V10H83V19H80V22H71V19H68V10H71V7Z" />
                        </mask>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M71 7H80V10H83V19H80V22H71V19H68V10H71V7Z" fill="#F7E901" />
                        <path d="M80 7H82V5H80V7ZM71 7V5H69V7H71ZM80 10H78V12H80V10ZM83 10H85V8H83V10ZM83 19V21H85V19H83ZM80 19V17H78V19H80ZM80 22V24H82V22H80ZM71 22H69V24H71V22ZM71 19H73V17H71V19ZM68 19H66V21H68V19ZM68 10V8H66V10H68ZM71 10V12H73V10H71ZM80 5H71V9H80V5ZM82 10V7H78V10H82ZM83 8H80V12H83V8ZM85 19V10H81V19H85ZM80 21H83V17H80V21ZM82 22V19H78V22H82ZM71 24H80V20H71V24ZM69 19V22H73V19H69ZM68 21H71V17H68V21ZM66 10V19H70V10H66ZM71 8H68V12H71V8ZM69 7V10H73V7H69Z" fill="#7E5701" mask="url(#path-5-inside-3_12_2)" />
                    </g>
                </g>
            </svg>
        </div>
    )
    else return (
        <div className="lobby loading">
            <img src={runningPikachu} alt="" />
            <h1>Loading..</h1>
        </div>
    )
}