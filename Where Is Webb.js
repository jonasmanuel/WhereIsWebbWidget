// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: space-shuttle;

async function createWidget() {
  let w = new ListWidget();
  let title = w.addText("Where is Webb?");
  w.addSpacer();
  title.font = Font.largeTitle();
  title.centerAlignText();
  let request = new Request("https://api.jwst-hub.com/track");

  /**
   * @typedef Temps
   * @type {object}
   * @property {number} tempWarmSide1C
   * @property {number} tempWarmSide2C
   * @property {number} tempCoolSide1C
   * @property {number} tempCoolSide2C
   * @property {number} tempInstMiriC
   * @property {number} tempInstNirCamC
   * @property {number} tempInstNirSpecC
   * @property {number} tempInstFgsNirissC
   * @property {number} tempInstFsmC
    */
  /**
   * @typedef TrackingResponse
   * @type {object}
   * @property {string} deploymentImgURL
   * @property {Temps} tempC
   * @property {string} timestamp
   */

  /**
   *  @type {TrackingResponse}
  */
  let response = await request.loadJSON();
  let sensors = await new Request("https://www.jwst.nasa.gov/content/webbLaunch/assets/images/extra/webbTempLocationsGradient1.4TweenAll-300px.jpg").loadImage();

  w.addImage(sensors);
  let row = w.addStack();
  row.centerAlignContent();
  row.addSpacer();
  let c1 = row.addStack();
  let c2 = row.addStack();
  row.addSpacer();
  c1.layoutVertically();
  c2.layoutVertically();

  // c1.addText("Since Launch: ");
  // c2.addText(response.launchElapsedTime);
  // c1.addText("From Earth: ");
  // c2.addText(response.distanceEarthKm + " km");
  // c1.addText("To L2: ");
  // c2.addText(response.distanceL2Km + " km");
  // c1.addText("Speed:");
  // c2.addText(response.speedKmS + " km/s");
  let temp = response.tempC;
  c1.addText("Warm Side")
  c1.addText(temp.tempWarmSide1C + " °C (a)");
  c1.addText(temp.tempWarmSide2C + " °C (b)" );
  c2.addText("Cool Side")
  c2.addText(temp.tempCoolSide1C + " °C (c)");
  c2.addText(temp.tempCoolSide2C + " °C (d)");
  c1.addText("MIRI/NIRCam/NirSpec")
  c1.addText(temp.tempInstMiriC + " °C (1)")
  c1.addText(temp.tempInstNirCamC + " °C (2)")
  c1.addText(temp.tempInstNirSpecC + " °C (3)")
  c2.addText("FGS-NIRISS/FSM")
  c2.addText(temp.tempInstFgsNirissC + " °C (4)")
  c2.addText(temp.tempInstFsmC + " °C (5)")

  
  w.addText(response.currentDeploymentStep);
  
  let image = await new Request(response.deploymentImgURL).loadImage();
  w.addImage(image).centerAlignImage();
  log(response);
  return w;
}

function drawProgress(percentageCompleted) {
  let total = Device.screenResolution().width - 240;
  let percentage = (total * percentageCompleted) / 100;
  let draw = new DrawContext();
  draw.respectScreenScale = true;
  draw.opaque = false;
  draw.size = new Size(total, 50);
  let path = new Path();
  let r = new Rect(0, 0, percentage, 50);
  let rr = path.addRoundedRect(r, 25, 25);
  draw.setFillColor(Color.red());

  draw.addPath(path);
  draw.fillPath();
  draw.setFont(Font.largeTitle());
  draw.drawText(percentageCompleted + "%", new Point(total / 2 - 50, 0));
  return draw.getImage();
}

let widget = await createWidget();

if (config.runsInWidget) Script.setWidget(widget);
else widget.presentLarge();

Script.complete();
