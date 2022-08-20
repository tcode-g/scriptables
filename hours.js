


/*
const noti = new Notification()
noti.title = "Yo"
noti.subtitle = "Sub"
noti.body = "This is some test text!"

Timer.schedule(3 * 1000, false, () => {
    noti.schedule()
})

eval("Timer.schedule(3 * 1000, false, () => {noti.schedule()})")
const al = new Alert()
al.title =  "DELIVERY"
al.addAction("3")
al.addAction("2")
al.addAction("1")
log(2)
log(await al.presentAlert())
*/

// have to use file manager to be able to get these values
const Files = FileManager.local()
const trackerFile = Files.joinPath(Files.documentsDirectory(), "tracker.json")
let trackingData = {}
let clockedIn = false
let onDelivery = false
if (!Files.fileExists(trackerFile)) {
  Files.writeString(trackerFile, JSON.stringify(trackingData))
} else {
  log(Files.readString(trackerFile))
}



function displayAlert(path) {
  let alert = new Alert()
  alert.title = "DELIVERY TRACKER"
  if (clockedIn == false) {
    alert.addAction("clock in")
    alert.addDestructiveAction("quit")
    alert.presentAlert().then((choice) => {
      if (choice == 0) {
        clockedIn = true
      }
    })
  } else {
    if (onDelivery == true) {
      alert.addAction("Text Customer")
      alert.addAction("Return")
      alert.addDestructiveAction("quit")
      alert.presentAlert().then((choice) => {
        if (choice == 0) {
          let alert2 = new Alert()
          alert2.title = "Customer Info"
          alert2.addTextField("Number", "Phone")
          alert2.addAction("Lobby")
          alert2.addAction("Front Door")  
          alert2.addDestructiveAction("quit")
          alert2.presentAlert().then((choice) => {
            if (choice == 0) {
              textCustomer(alert2.textFieldValue(0), 1)
            } else if (choice == 1) {
              textCustomer(alert2.textFieldValue(0), 2)
            }
          })
        } else if (choice == 1) {
          
        }
      })
    } else {
      
    }
  }
}
function textCustomer(number, selection) {
  if (number && selection) {
    const msg = new Message()
    if (selection == 1) {
      msg.body = "Hello this is your Jimmy Johns Delivery Driver. I've left your food in the lobby. Enjoy and have a good day!"
    } else if (selection == 2) {
      msg.body = "Hello this is your Jimmy Johns Delivery Driver. I've left your food at the front door. Enjoy and have a good day!"
    }
    msg.recipients = [number.toString()]
    msg.send()
  }
}
function makeNotification(args) {
  
}
// textCustomer(3219992453, 1)
displayAlert()
