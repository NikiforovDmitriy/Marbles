// @ts-ignore
import _ammo from '@enable3d/ammo-on-nodejs/ammo/ammo.js'
import { Physics, ServerClock } from '@enable3d/ammo-on-nodejs'

import geckos, { Data } from '@geckos.io/server'
import http from 'http'
import express from 'express'

const port = 3000
const app = express()
const server = http.createServer(app)

class ServerScene {
    physics!: Physics
    factory: any
    objects: any

    constructor() {
        this.init()
        //this.create()
    }

    init() {
        // test if we have access to Ammo
        console.log('Ammo', new Ammo.btVector3(1, 2, 3).y() === 2)

        // init the Physics
        this.physics = new Physics()
        this.factory = this.physics.factory
    }
}

// wait for Ammo to be loaded
_ammo().then((ammo: typeof Ammo) => {
    globalThis.Ammo = ammo

    // start server scene
    new ServerScene()
})
