
export default function HealingAnimation() {
    return (
        <svg
            width="85"
            height="74"
            viewBox="0 0 85 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="heal">
                <path
                    id="health5"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M73.7 17H69.7V23.4H64.1V27.4H69.7V33H73.7V27.4H79.3V23.4H73.7V17Z"
                    fill="#E64339"
                    style={{"--delay" : '0' }}
                />
                <path
                    id="health4"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M48.1 25H43.1V33H36.1V38H43.1V45H48.1V38H55.1V33H48.1V25Z"
                    fill="#F0443A"
                    style={{"--delay" : '1' }}
                />
                <path
                    id="health3"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M29.7 2H25.7V8.4H20.1V12.4H25.7V18H29.7V12.4H35.3V8.4H29.7V2Z"
                    fill="#D13930"
                    style={{"--delay" : '2' }}
                />
                <path
                    id="health2"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.8 46H12.3V53.2H6V57.7H12.3V64H16.8V57.7H23.1V53.2H16.8V46Z"
                    fill="#F0443A"
                    style={{"--delay" : '2.5' }}
                />
                <path
                    id="health1"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M62.9 63H60.9V66.2H58.1V68.2H60.9V71H62.9V68.2H65.7V66.2H62.9V63Z"
                    fill="#BB322A"
                    style={{"--delay" : '3' }}
                />
            </g>
        </svg>
    )
}