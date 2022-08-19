



const noti = new Notification()
noti.title = "Yo"
noti.subtitle = "Sub"
noti.body = "This is some test text!"

// 10 seconds after 
// Timer.schedule(3 * 1000, false, () => {
//     noti.schedule()
// })
// 
// eval("Timer.schedule(3 * 1000, false, () => {noti.schedule()})")
let clockedIn = false
let onDelivery = false
const al = new Alert()
al.title =  "DELIVERY"
al.addAction("3")
al.addAction("2")
al.addAction("1")
// 
// log(await al.presentAlert())

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
