onEvent("player.data_from_server.get_screen_size", event => {
    let window = java("net.minecraft.client.Minecraft").getInstance().getWindow()
    Client.player.sendData("receive_screen_size", {screenSize: [window.getGuiScaledWidth(), window.getGuiScaledHeight()]})
})