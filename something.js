const alert = new Alert()
alert.title = "TESTING"
alert.addAction("action1")
alert.addDestructiveAction("quit")
log(await alert.presentAlert())