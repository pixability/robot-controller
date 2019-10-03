import Runtime from '../js/etherealjs/src/runtime.js';
import Component from '../js/etherealjs/src/component.js';
import { websocketUrl } from './config.js';
import Transport from './transport.js';
import Transmitter from './transmitter.js';
const COLORS = {
    GRANITE: '#383A4A',
    INSPIRE: '#FF752d',
    WHITE: '#fff',
};

const RemoteControlTransport = new Transport({ url: websocketUrl });
const RemoteControlTransmitter = new Transmitter({
    transport: RemoteControlTransport,
});

RemoteControlTransport.receive = event => {
    console.log('got event from socket', event);
};

class Spinner extends Component {
    style() {
        return {
            '': {
                background: '#ffffff',
                '-webkit-animation': 'load1 1s infinite ease-in-out',
                animation: 'load1 1s infinite ease-in-out',
                width: '1em',
                height: '4em',
                color: '#ffffff',
                'font-size': '11px',
                position: 'relative',
                '-webkit-transform': 'translateZ(0)',
                '-ms-transform': 'translateZ(0)',
                transform: 'translateZ(0)',
                '-webkit-animation-delay': '-0.16s',
                'animation-delay': '-0.16s',
            },
            ':before': {
                background: '#ffffff',
                '-webkit-animation': 'load1 1s infinite ease-in-out',
                animation: 'load1 1s infinite ease-in-out',
                width: '1em',
                height: '4em',
                position: 'absolute',
                top: '0',
                content: "''",
                left: '-1.5em',
                '-webkit-animation-delay': '-0.32s',
                'animation-delay': '-0.32s',
            },
            ':after': {
                background: '#ffffff',
                '-webkit-animation': 'load1 1s infinite ease-in-out',
                animation: 'load1 1s infinite ease-in-out',
                width: '1em',
                height: '4em',
                position: 'absolute',
                top: '0',
                content: "''",
                left: '1.5em',
            },
        };
    }
    draw() {
        return `<div></div>`;
    }
}

class Pip extends Component {
    constructor(config) {
        super(config);
        if(config.attributes['hangouts-url']){
            console.log('woa')
            // window.open(config.attributes['hangouts-url'].value, '_blank')
        }
    }
    drag(event) {
        console.log('evewnt', event);
        const top = event.offsetY;
        const left = event.offsetX;
        if (top !== 0 && left !== 0) {
            this.setStore({ ...this.store, top, left });
        }
    }
    style() {
        return {
            '': {
                display: 'flex',
                height: '60%',
                background: '#ccc',
                'flex-direction': 'column',
                position: 'relative',
                width: '100%',
                '.main-video': {
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,.5)',
                },
                '.pip-video': {
                    width: '20%',
                    height: '30%',
                    position: 'absolute',
                    top: `${this.store.top}px` || '20px',
                    left: `${this.store.left}px` || '20px',
                    background: 'rgba(255,255,255,.3)',
                },
            },
        };
    }
    draw() {
        return `
            <div>
                     <div class="main-video">Main Video</div><div class="pip-video" draggable="true" e drag="drag">Pip Video</div>
            </div>
        `;
    }
}

class Controller extends Component {
    constructor(config) {
        super(config);
        this.transmitter = RemoteControlTransmitter;
        this.transmitter.subscribe(this);
    }
    style() {
        return {
            '': {
                display: 'flex',
                flex: '1',
                'justify-content': 'space-around',
                'align-items': 'center',
                width: '100%',
                '.d-pad': {
                    width: '12rem',
                    height: '12rem',
                    display: 'flex',
                    'flex-direction': 'column',
                    'justify-content': 'space-between',
                },
                '.main-button button': {
                    'font-size': '1.5rem',
                    color: '#fff',
                    'background-color': 'red',
                    height: '8rem',
                    width: '8rem',
                    'border-radius': '16rem',
                    opacity: '.5',
                },
                '.main-button.A button': {
                    opacity: '1',
                },
                '.button': {
                    opacity: '0.3',
                    width: '4rem',
                    height: '4rem',
                    'border-radius': '8rem',
                    display: 'flex',
                    'justify-content': 'center',
                    'align-items': 'center',
                    background: COLORS.INSPIRE,
                },
                '.space-between-row': {
                    display: 'flex',
                    'flex-direction': 'row',
                    'justify-content': 'space-between',
                },
                '.center-row': {
                    display: 'flex',
                    'flex-direction': 'row',
                    flex: 1,
                    'justify-content': 'center',
                },
                '.button i': {
                    'font-size': '3rem',
                    color: COLORS.WHITE,
                },
                '.U .up': {
                    opacity: '1',
                },
                '.D .down': {
                    opacity: '1',
                },
                '.R .right': {
                    opacity: '1',
                },
                '.L .left': {
                    opacity: '1',
                },
            },
        };
    }
    handleKeydown(event) {
        const { code } = event;

        console.log('keydown event', event);
    }
    handleKeyup(event) {
        console.log('keyup event', event);
    }
    draw() {
        if (!this.transmitter) {
            return `<div>loading</div>`;
        }
        const {
            store: { signalMap: signals },
        } = this.transmitter;
        return `
            <div>
                <div class="main-button ${Object.keys(signals).join(' ')}">
                    <button type="button">ATTACK</button>
                </div>
                <div class="d-pad ${Object.keys(signals).join(' ')}">
                    <div class="center-row">
                        <div class="button up">
                            <i class="material-icons">
                                arrow_upward
                            </i>
                        </div>
                    </div>
                    <div class="space-between-row">
                        <div class="button left">
                            <i class="material-icons">
                                arrow_back
                            </i>
                        </div>
                        <div class="button right">
                            <i class="material-icons">
                                arrow_forward
                            </i>
                        </div>

                    </div>
                    <div class="center-row">
                        <div class="button down">
                            <i class="material-icons">
                                arrow_downward
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

new Runtime({
    properties: {
        selected: 'Welcome',
        values: {},
        active: 'Register',
    },
    library: {
        Pip: Pip,
        Controller: Controller,
    },
    styles: () => {
        return {
            '*': {
                'font-family': "'Open Sans', sans-serif",
                margin: '0',
                padding: '0',
                'box-sizing': 'border-box',
                'font-weight': '200',
                color: COLORS.GRANITE,
            },
            html: {
                height: '100%',
            },
            body: {
                height: '100%',
                width: '100%',
                'background-color': '#eee',
                display: 'flex',
                'justify-content': 'flex-start',
                'align-items': 'center',
                'flex-direction': 'column',
            },
            a: {
                color: '#0e689b',
                'text-decoration': 'underline',
                cursor: 'pointer',
            },
            '.container': {
                width: '1350px',
                margin: '0 auto',
            },

            '@-webkit-keyframes load1': {
                '0%,80%,100%': {
                    'box-shadow': '0 0',
                    height: '4em',
                },
                '40%': {
                    'box-shadow': '0 -2em',
                    height: '5em',
                },
            },
            '@keyframes load1': {
                '{0%,80%,100%': {
                    'box-shadow': '0 0',
                    height: '4em}',
                },
                '{40%': {
                    'box-shadow': '0 -2em',
                    height: '5em}',
                },
            },
        };
    },
});
