// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: space-shuttle;

async function createWidget(){
  let w = new ListWidget()
    let title = w.addText("Where is Webb?")
    w.addSpacer()
     title.font=Font.largeTitle()
    title.centerAlignText()  
    let request = new Request("https://api.jwst-hub.com/track")
 
   let response = await request.loadJSON() 
w.addImage(drawProgress(response.percentageCompleted))
  let row = w.addStack()
   row.centerAlignContent()
  row.addSpacer()
  let c1 = row.addStack();
  let c2 = row.addStack();
   row. addSpacer()
  c1.layoutVertically();    
  c2.layoutVertically();
   
    c1.addText("From Earth: ");  
  c2.addText(response.distanceEarthKm +" km")
    c1.addText("To L2: ");  
    c2.addText(response.distanceL2Km+" km");
    c1.addText("Speed:")
    c2.addText(response.speedKmS+" km/s")
    let temp = response.tempC;
    c1.addText(temp.tempWarmSide1C +" °C")  
    c1.addText(temp.tempWarmSide2C +" °C")      
    c2.addText(temp.tempCoolSide1C +" °C")  
    c2.addText(temp.tempCoolSide2C +" °C")
    let image = await new Request(response.deploymentImgURL).loadImage();
    
    w.addText(response.currentDeploymentStep)

   w.addImage(image).centerAlignImage()
    log(response)
    return w
}

function drawProgress(percentageCompleted){
  let total = Device.screenResolution().width - 240;
let percentage = total *  percentageCompleted / 100;
let draw = new DrawContext();  
draw.respectScreenScale = true
draw.opaque =false;
draw.size = new Size(total, 50)
let path = new Path()
let r =new Rect(0, 0, percentage, 50)
let rr = path.addRoundedRect(r, 25, 25)
draw.setFillColor(Color.red())

draw.addPath(path)
draw.fillPath()
draw.setFont(Font.largeTitle())
draw.drawText(percentageCompleted+"%", new Point(total/2-50, 0))
return draw.getImage();
}

let widget = await createWidget()

if (config.runsInWidget)
 Script.setWidget(widget)
 else
widget.presentLarge()


Script.complete()