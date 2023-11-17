// @ts-ignore
import _ammo from '@enable3d/ammo-on-nodejs/ammo/ammo.js'
import { ExtendedObject3D, Physics, ServerClock } from '@enable3d/ammo-on-nodejs'

import geckos, { Data, ServerChannel } from '@geckos.io/server'
import http from 'http'
import express from 'express'

const port = 3000
const app = express()
const server = http.createServer(app)
const io = geckos({
    multiplex: true, // default
})

app.use('/', express.static('public'))
io.addServer(server)

class ServerScene {
    physics!: Physics
    factory: any
    objects: any

    constructor() {
        this.init()
        this.create()
        this.startServer()
    }

    startServer() {
        io.onConnection((channel: ServerChannel) => {})
        server.listen(port, () => {
            console.log(`Example app listening on http://localhost:${port}/`)
        })
    }

    init() {
        // test if we have access to Ammo
        console.log('Ammo', new Ammo.btVector3(1, 2, 3).y() === 2)

        // init the Physics
        this.physics = new Physics()
        this.factory = this.physics.factory
    }

    create() {
        const ground = this.physics.add.box({
            name: 'ground',
            width: 40,
            depth: 40,
            collisionFlags: 2,
            mass: 0,
        })

        this.send(ground)

        const box = this.physics.add.box({ name: 'box', y: 5 })

        this.objects = [ground, box]

        const clock = new ServerClock()

        if (process.env.NODE_ENV !== 'production') clock.disableHighAccuracy()

        clock.onTick((delta) => this.update(delta))

        setInterval(() => this.send(box), 1000 / 30)
    }

    send(object: ExtendedObject3D) {
        const { name, position: pos, quaternion: quat } = object

        const fixed = (n: number, f: number) => {
            return parseFloat(n.toFixed(f))
        }

        const updates = {
            name,

            pos: {
                x: fixed(pos.x, 2),
                y: fixed(pos.y, 2),
                z: fixed(pos.z, 2),
            },
            quat: {
                x: fixed(quat.x, 3),
                y: fixed(quat.y, 3),
                z: fixed(quat.z, 3),
                w: fixed(quat.w, 3),
            },
        }

        io.emit('updates', updates)
    }

    update(delta: number) {
        this.physics.update(delta * 1000)
    }
}

// wait for Ammo to be loaded
_ammo().then((ammo: typeof Ammo) => {
    globalThis.Ammo = ammo

    // start server scene
    new ServerScene()
})
