export default class Transport {
    constructor({ url }) {
        this.config = { url }
        this.socket = new WebSocket(this.config.url)
        this.socket.onopen = () => {
            this.subscribe()
        }
        this.socket.onmessage = (event) => {
            let parsed = JSON.parse(event.data)
            this.receive(parsed)
        }
        this.socket.onerror = (error) => {
            this.active = false
            this.onerror(error)
        }
    }
    send(event) {
        try {
            const json = JSON.stringify(event)
            this.socket.send(json)
        } catch (error) {
            console.warn('Messenger.Transport: Error on send', error)
            create({ ...error })
        }
    }
    receive() {}
    onerror() {}
    subscribe() {
        this.send({
            module: 'connections',
            operation: 'subscribe',
            payload: { type: 'controller' },
        })
        setInterval(() => {
            this.send({
                module: 'connections',
                operation: 'keepalive',
                payload: '❤️',
            })
        }, 20000)
    }
}
