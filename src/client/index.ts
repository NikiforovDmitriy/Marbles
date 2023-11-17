console.log("I's so cool!")

new EventSource('/esbuild').addEventListener('change', () => location.reload())

import { Project, Scene3D, ExtendedObject3D, THREE } from 'enable3d'
import geckos from '@geckos.io/client'

class Geckos extends Scene3D {
    box?: ExtendedObject3D
    ground?: ExtendedObject3D

    geckos() {
        const channel = geckos()

        channel.onConnect((error) => {
            if (error) {
                console.error(error.message)
                return
            }

            channel.on('updates', (updates: any) => {
                const u = updates
                if (u.name === 'box') {
                    if (this.box) {
                        this.box.position.set(u.pos.x, u.pos.y, u.pos.z)
                        this.box.quaternion.set(u.quat.x, u.quat.y, u.quat.z, u.quat.w)
                    } else {
                        this.box = this.add.box({}, { phong: { color: 'red' } })
                    }
                } else if (u.name === 'ground') {
                    if (!this.ground) {
                        this.ground = this.add.box(
                            { width: 40, depth: 40 },
                            { phong: { color: 'blue' } }
                        )
                        this.ground.position.set(u.pos.x, u.pos.y, u.pos.z)
                        this.ground.quaternion.set(u.quat.x, u.quat.y, u.quat.z, u.quat.w)
                    }
                }
            })
        })
    }

    init() {
        this.setSize(window.innerWidth, window.innerHeight)
        //this.warpSpeed('-orbitControls')
        this.camera.position.set(0, 2, 10)
        this.camera.lookAt(0, 0, 0)
    }

    create() {
        this.geckos()
    }

    update() {
        if (this.box) {
            this.camera.position.copy(this.box.position).add(new THREE.Vector3(0, 3, 7))
            this.camera.lookAt(this.box.position.clone())
        }
    }
}

new Project({ scenes: [Geckos], parent: 'canvas', antialias: true })
