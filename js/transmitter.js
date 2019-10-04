import Satellite from '../js/etherealjs/src/satellite.js';
import Transport from './transport.js';

export default class Transmitter extends Satellite {
    constructor(store) {
        super(store);

        this.modules = {
            connections: {
                updateTotalConnections: this.updateTotalConnections,
                subscribeSuccess: this.subscribeSuccess
            },
            controller: {
                press: ({key}) => this.setStore({...this.store, signalMap: {
                    ...this.store.signalMap,
                    [key]: true
                }}),
                depress: ({key}) => {
                    delete this.store.signalMap[key]
                    this.setStore({...this.store})
                }
            }
        };

        this.store = { ...store, signalMap: {}, activeConnectionsCount: 0, connectionStatus: 'DISCONNECTED' };

        this.buttonMap = {
            ArrowUp: 'U',
            ArrowDown: 'D',
            ArrowRight: 'R',
            ArrowLeft: 'L',
            KeyA: 'A',
        };

        window.addEventListener('keydown', e => {
            const { code } = e;
            if (
                this.buttonMap[code] &&
                !this.store.signalMap[this.buttonMap[code]]
            ) {
                this.setStore({
                    ...this.store,
                    signalMap: {
                        ...this.store.signalMap,
                        [this.buttonMap[code]]: true,
                    },
                });
                this.transmit({
                    module: 'controller',
                    operation: 'press',
                    payload: { key: this.buttonMap[code] },
                });
            }
        });
        window.addEventListener('keyup', e => {
            const { code } = e;
            if (
                this.buttonMap[code] &&
                this.store.signalMap[this.buttonMap[code]]
            ) {
                delete this.store.signalMap[this.buttonMap[code]];
                this.setStore(this.store);
                this.transmit({
                    module: 'controller',
                    operation: 'depress',
                    payload: { key: this.buttonMap[code] },
                });
            }
        });
    }
    start(websocketUrl) {
        this.transport = new Transport({ url: websocketUrl });
        this.transport.receive = (event) => this.receive(event);
    }
    transmit(event) {
        try {
            this.transport.send(event);
        } catch (error) {
            throw new Error(error);
        }
    }
    receive(event) {
        console.log('got an event yo!', event);
        if (
            !this.modules[event.module] ||
            !this.modules[event.module][event.operation]
        ) {
            throw new Error(
                'received an event with an invalid operation or module'
            );
        }
        this.modules[event.module][event.operation](event.payload);
    }
    subscribeSuccess = ({client_id}) => {
        this.setStore({...this.store, connectionStatus: 'CONNECTED'})
    }
    updateTotalConnections = ({ count }) => {
        this.setStore({ ...this.store, activeConnectionsCount: count });
    }
}
