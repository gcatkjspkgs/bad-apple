const encodings = global.bad_apple_encodings
const vidSize = [256, 144]
const fps = 40
let screenSize

/**
 * @param {Array<Number>} pixArr 
 * @param {Number} f 
 * @param {Internal.PlayerJS} player 
 * @param {Internal.ServerJS} server 
 */
function drawNextFrame(pixArr, f, player, server) {
    if (encodings.length==f) {
        server.scheduleInTicks(60, () => {
            player.paint({'*': {remove: true}})
        })
        return
    }

    let pixels = {}
    encodings[f].forEach(p => {
        let pixArrPos = p[1]*vidSize[0]+p[0]
        let color = pixArr[pixArrPos]==0 ? '#ffffff' : '#010101'

        pixels[`${p[0]}x${p[1]}`] = {color: color}
        pixArr[pixArrPos] = +(!pixArr[pixArrPos])
    })
    player.paint(pixels)

    server.schedule(1000/fps, () => {drawNextFrame(pixArr, f+1, player, server)})
    // drawNextFrame(pixArr, f+1, player, server)
}

onEvent("command.registry", event => {
    event.register(
        java("net.minecraft.commands.Commands").literal("badapple").executes(ctx => {
            let player = ctx.source.entity.asKJS().player
            player.sendData("get_screen_size", {})

            event.server.scheduleInTicks(30, () => {
                let pixelSizeX = screenSize[0]/vidSize[0]
                let pixelSizeY = screenSize[1]/vidSize[1]
                let pixArr = []

                for (let x = 0; x < vidSize[0]; x++) {
                    for (let y = 0; y < vidSize[1]; y++) {
                        let pixel = {}
                        pixel[`${x}x${y}`] = {type: 'rectangle', x: x*pixelSizeX, y: y*pixelSizeY, w: pixelSizeX, h: pixelSizeY, color: '#010101'}
                        pixArr.push(0)
                        player.paint(pixel)
                    }
                }

                drawNextFrame(pixArr, 0, player, event.server)
            })
            return 1
        })
    )
})

onEvent("player.data_from_client.receive_screen_size", event => {
    screenSize = event.data.screenSize
})