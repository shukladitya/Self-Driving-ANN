const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 1000;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 700;

//global mode

let globalMode = localStorage.getItem("globalMode") || "AI";
let automaticFlag = false;

document.addEventListener("keydown", (k) => {
  if (k.key == "d" && globalMode == "AI") {
    globalMode = "KEYS";
    location.reload();
  } else if (k.key == "d") {
    globalMode = "AI";
    location.reload();
  }

  if (k.key == "a" && !automaticFlag) automaticFlag = true;
  else automaticFlag = false;

  localStorage.setItem("globalMode", globalMode);
});

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

var traffic = [
  //new Car(road.getLaneCenter(1), -100, 60, 100, "DUMMY", 2, getRandomColor()),
];

traffic = [...traffic, ...generateTrafficCar()];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(
      new Car(
        road.getLaneCenter(Math.ceil(Math.random() * 3) - 1),
        Math.ceil(Math.random() * 101) - 1,
        60,
        100,
        globalMode
      )
    );
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
