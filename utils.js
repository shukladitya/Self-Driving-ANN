function lerp(A, B, t) {
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

function getRGBA(value) {
  const alpha = Math.abs(value);
  if (value < 0) {
    R = 50;
    G = 130;
    B = 184;
  } else {
    R = 225;
    G = 225;
    B = 255;
  }

  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return "hsl(" + hue + ", 100%, 60%)";
}

const MIN_Y_OFFSET = 150; // minimum vertical distance between cars in the same lane
const MAX_Y_OFFSET = 300; // maximum vertical distance between cars in the same lane

function generateTrafficCar() {
  temp = [];
  speed1 = Math.ceil(Math.random() * 5);
  for (i = 0; i < 20; i++) {
    temp.push(
      new Car(
        road.getLaneCenter(0),
        (Math.ceil(Math.random() * 5000) - 1) * -1 - 200,
        60,
        100,
        "DUMMY",
        speed1,
        "transparent"
      )
    );
  }
  speed2 = Math.ceil(Math.random() * 5);
  for (i = 0; i < 20; i++) {
    temp.push(
      new Car(
        road.getLaneCenter(1),
        (Math.ceil(Math.random() * 5000) - 1) * -1 - 200,
        60,
        100,
        "DUMMY",
        speed2,
        "transparent"
      )
    );
  }
  speed3 = Math.ceil(Math.random() * 5);
  for (i = 0; i < 20; i++) {
    temp.push(
      new Car(
        road.getLaneCenter(2),
        (Math.ceil(Math.random() * 5000) - 1) * -1 - 200,
        60,
        100,
        "DUMMY",
        speed3,
        "transparent"
      )
    );
  }
  return temp;
}
