import Satellite from '../js/etherealjs/src/satellite.js';

export default class Transmitter extends Satellite {
    constructor(store) {
        super(store);
        this.store = { ...store, signalMap: {} };
        this.buttonMap = {
            ArrowUp: 'U',
            ArrowDown: 'D',
            ArrowRight: 'R',
            ArrowLeft: 'L',
            KeyA: 'A'
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
                        [this.buttonMap[code]]: true
                    }
                });
                this.transmit({
                    module: 'receiver',
                    operation: 'press',
                    payload: { key: this.buttonMap[code] }
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
                    module: 'receiver',
                    operation: 'depress',
                    payload: { key: this.buttonMap[code] }
                });
            }
        });
    }
    transmit(event) {
        try {
            const stringified = JSON.stringify(event);
            console.log('going to transmit', stringified);
        } catch (error) {
            throw new Error(error);
        }
    }
}
