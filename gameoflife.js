function drawPixel(ctx,x,y,colour) {
  ctx.fillStyle = colour;
  ctx.fillRect(x,y,1,1);
}

function generateRandomBoolArray(length) {
  var empty = new Array(length);
  empty.fill(false);
  var bools = empty.map( function(el) {
    var randomBool = Math.random() >= 0.5;
    return randomBool;
  });
  return bools;
}

function singleCentre(length) {
  var empty = new Array(length);
  empty.fill(false);
  empty[length / 2] = true;
  return empty;
}

function generateFilledWith(length,fillState) {
  var empty = new Array(length);
  empty.fill(fillState);
  return empty
}

function generateAlternating(length) {
  var empty = new Array(length);
  empty.fill(false);
  return empty.map( function(element,index) {
    return index % 2 == 0;
  });
}

function drawBoolArrayHorizontallyFromPoint(ctx,x,y,colour,bools) {
  bools.forEach( function(bool,index) {
    if (bool) {
      drawPixel(ctx,x + index, y, colour)
    }
  });
}

function getRuleIndex(left,middle,right) {
  return (left * 4) + (middle * 2) + (right * 1);
}

function generateRuleData(ruleNumber) {
  ruleData = []
  for (var i = 0; i < 8; i++)
      ruleData[i] = ((ruleNumber >> i) & 1 == 1);
  return ruleData;
}

function ruleIndexArray(rulePartIndex) {
  ruleData = []
  for (var i = 0; i < 3; i++)
      ruleData[i] = ((rulePartIndex >> i) & 1 == 1);
  return ruleData;
}

function generateNextLine(prevLine,ruleData) {
  var nextLine = prevLine.map( function(current,index,values) {
    var width = values.length;
    var left  = values[((index - 1)+ width) % width];
    var right = values[(index + 1) % width];

    var ruleIndex = getRuleIndex(left,current,right);

    return ruleData[ruleIndex];
  });
  return nextLine;
}

function drawElementaryCellularAutomata(startingLine,ruleData,canvasName) {

  var c = document.getElementById(canvasName);
  var ctx = c.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  var width = c.width;
  var height = c.height;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0,0,width,height);

  drawBoolArrayHorizontallyFromPoint(ctx,0,0,'#000000',startingLine);
  var prevLine = startingLine;
  for (y = 1;y < height;y++) {
    var nextLine = generateNextLine(prevLine,ruleData);
    drawBoolArrayHorizontallyFromPoint(ctx,0,y,'#000000',nextLine);
    var prevLine = nextLine;
  }
}

function drawRule(context,ruleIndex,rule,width,height) {
  var xOffset = 10;
  var yOffset = 15;
  var size = 10;
  var rulePartArray = ruleIndexArray(ruleIndex)
  rulePartArray.forEach(function(rulePart,index) {
    if (rulePart) {
      context.fillStyle = "#000000";
      context.fillRect((index*size) + xOffset,0 + yOffset,size,size);
      context.strokeRect((index*size) + xOffset,0 + yOffset,size,size);
    } else {
      context.fillStyle = "#000000";
      context.strokeRect((index*size) + xOffset,0+ yOffset,size,size);
    }
  });
  if (rule) {
    context.fillStyle = "#000000";
    context.fillRect(size + xOffset,size+ yOffset,size,size);
    context.strokeRect(size + xOffset,size+ yOffset,size,size);
  } else {
    context.fillStyle = "#000000";
    context.strokeRect(size + xOffset,size+ yOffset,size,size);
  }
}

function drawRuleVisualisation(ruleData,canvasClass) {
  var rulePartCanvases = document.getElementsByClassName(canvasClass);

  for(i = 0;i<rulePartCanvases.length;i++) {
    var canvas = rulePartCanvases[i];
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,width,height);

    drawRule(ctx,i,ruleData[i],width,height);
  }
}

function draw() {

  var eCACanvasID = "gameoflife";
  var rulePartClass = "rulePart"

  var ruleNumberText = document.getElementById('ruleNumber').value
  var ruleNumber = parseInt(ruleNumberText);
  var ruleData = generateRuleData(ruleNumber);

  var startStateRadios = document.getElementsByName("startState");

  var startState = "";
  startStateRadios.forEach( function(radio) {
    if (radio.checked)
      startState = radio.value;
  });
  var width = 1000;

  var startingLine = singleCentre(width);

  if (startState == "random")
    startingLine = generateRandomBoolArray(width);
  else if (startState == "alternating")
    startingLine = generateAlternating(width);
  else if (startState == "singleLeft") {
    startingLine = generateFilledWith(width,false);
    startingLine[0] = true;
  }
  else if (startState == "singleRight") {
    startingLine = generateFilledWith(width,false);
    startingLine[width - 1] = true
  }
  drawRuleVisualisation(ruleData,rulePartClass)
  drawElementaryCellularAutomata(startingLine,ruleData,eCACanvasID);
}
