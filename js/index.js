var sketch = function(p5) {
  var width = 700;
  var height = 450;
  var x = width / 2;
  var y = height / 2;
  var particles = [];
  var etages = [];
  var etagesPosition = [];
  var trajets = [];
  var stepWidth = (width / 7) - 30;

  p5.setup = function() {
    var canvas = p5.createCanvas(width, height);
    canvas.parent('canvasHolder');
    p5.background(51);
    p5.smooth();

    etageSetup();
    trajetSetup();
  };

  p5.draw = function() {
    //particuleManager();
    p5.background(51);

    trajetManager();
    etageManager();
  };

  var etageManager = function() {
    // Looping through backwards to delete
    for (var i = etages.length - 1; i >= 0; i--) {
      var etage = etages[i];
      etage.run();

    }
  };

  var etageSetup = function() {
    var size = 30;
    var top = (height / 2);
    var color = [];

    color[0] = p5.createVector(81, 159, 204);
    color[1] = p5.createVector(137, 147, 153);
    color[2] = p5.createVector(126, 255, 233);
    color[3] = p5.createVector(255, 199, 190);
    color[4] = p5.createVector(204, 81, 85);
    color[5] = p5.createVector(63, 127, 116);
    color[6] = p5.createVector(101, 127, 123);
    color[7] = p5.createVector(255, 232, 126);

    for (var i = 0; i <= 7; i++) {
      var position = p5.createVector(stepWidth * (i + 1), top);
      etages.push(new Etage(p5, position, size, i, trajets));
      etages[i].setup(color[i]);
      etagesPosition.push(position);
    };
  };

  var trajetSetup = function() {
    var randomTime = p5.random(20, 50);
    for (var i = 0; i < randomTime; i++) {
      var randomEtageStart = parseInt(p5.random(0, 8));
      var randomEtageEnd = parseInt(p5.random(0, 8));
      trajets.push(new Trajet(p5, etagesPosition, randomEtageStart, randomEtageEnd, stepWidth, etages[randomEtageStart]));
    };

    for (var i = trajets.length - 1; i >= 0; i--) {
      var trajet = trajets[i];
      trajet.setup();
    }

  };

  var trajetManager = function() {

    for (var i = trajets.length - 1; i >= 0; i--) {
      var trajet = trajets[i];
      trajet.run();
    }

  };

};

var Etage = function(p5, position, originalSize, floor) {

  this.position = position;
  this.originalSize = originalSize;
  this.size = this.originalSize;
  this.color;
  this.floor = floor;
  this.state = 0;

  this.setup = function(color) {
    this.color = color;
  };

  this.run = function() {
    this.update();
    this.display();
  };

  // Method to update position
  this.update = function() {
    p5.noStroke();
    var dist = p5.dist(p5.mouseX, p5.mouseY, this.position.x, this.position.y);
    p5.fill(this.color.x, this.color.y, this.color.z);

    if (dist >= this.size / 2) {
      this.size = this.originalSize;
      this.state = 0;
    } else {
      this.size = this.originalSize * 1.3;
      this.state = 1;
    }
  };

  // Method to display
  this.display = function() {
    p5.ellipse(this.position.x, this.position.y, this.size, this.size);
    p5.fill(0);
    p5.text(this.floor, position.x - 3, position.y + 4);
  };

  //getters 
  this.setPosition = function(x, y) {
    this.position.x = x;
    this.position.y = y;
  };

  //setters
  this.getPosition = function() {
    return this.position;
  }

  this.getColor = function() {
    return this.color;
  };

  this.getState = function() {
    return this.state;
  };

};

var Trajet = function(p5, etagesPosition, etageStart, etageEnd, stepWidth, etage) {

  this.start = etagesPosition[etageStart];
  this.end = etagesPosition[etageEnd];
  this.orientation = 1;
  this.middle = 0;
  this.color = p5.createVector(255, 255, 255);

  this.setup = function() {
    this.middle = this.findMiddle();
    this.r1 = p5.random(0, this.middle);
    this.r2 = p5.random(0, this.middle);
    this.rh = p5.random(0, this.middle / 8);

    this.color = etage.getColor();
  };

  this.run = function() {
    this.display();

  };

  // Method to display
  this.display = function() {
    if (etage.getState() == 1) {
      p5.stroke(this.color.x, this.color.y, this.color.z);
      p5.fill(this.color.x, this.color.y, this.color.z, 50);
    } else {
      p5.stroke(this.color.x, this.color.y, this.color.z, 50);
      p5.fill(this.color.x, this.color.y, this.color.z, 5);
    }

    var bezierVariation1 = this.middle - this.r1;
    var bezierVariation2 = this.middle + this.r2;
    var hauteur = this.middle + this.rh;

    if (etageStart < etageEnd) {
      p5.bezier(
        this.start.x, this.start.y,
        this.start.x + bezierVariation1, this.start.y - hauteur,
        this.start.x + bezierVariation2, this.start.y - hauteur,
        this.end.x, this.end.y);
    } else {
      p5.bezier(
        this.start.x, this.start.y,
        this.start.x - bezierVariation1, this.start.y + hauteur,
        this.start.x - bezierVariation2, this.start.y + hauteur,
        this.end.x, this.end.y);
    }
  }

  //Helpers
  this.findMiddle = function() {
    var lenght;
    if (etageStart < etageEnd) {
      var lenght = ((etageEnd - etageStart) * stepWidth) / 2;
    } else {
      var lenght = ((etageStart - etageEnd) * stepWidth) / 2;
    }
    return lenght;
  };

  this.setColor = function() {

  };

};

var myp5 = new p5(sketch);