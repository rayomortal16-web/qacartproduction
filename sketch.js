let canvas3D;
let anguloRotacion = 0;
let bloques = [];
let destino;
let bloqueActivo = null;
let drag = false;
let difX, difY;
let inicioX, inicioY;
let posicionesIniciales = [];

let esferas = [];
let texturasPelotas = [];

function preload() {
  // Cargar las 5 texturas de pelotas
  texturasPelotas[0] = loadImage("imagenes/pelota1.png");
  texturasPelotas[1] = loadImage("imagenes/pelota2.png");
  texturasPelotas[2] = loadImage("imagenes/pelota3.png");
  texturasPelotas[3] = loadImage("imagenes/pelota4.png");
  texturasPelotas[4] = loadImage("imagenes/pelota5.png");
}

function setup() {
  const contenedor = document.getElementById('contenedor-3d');
  const w = contenedor.clientWidth;
  const h = contenedor.clientHeight || 500;
  
  canvas3D = createCanvas(w, h, WEBGL);
  canvas3D.parent('contenedor-3d');
  angleMode(DEGREES);

  texturasPelotas = shuffle(texturasPelotas);

  for (let i = 0; i < 5; i++) {
    esferas.push({
      x: (i - 2) * 150,
      y: random(-50, 50),
      z: random(-100, 100),
      radio: random(40, 70),
      textura: texturasPelotas[i],
      rotacion: random(360)
    });
  }

  destino = select('#zona-drop-destino');
  
  let todasLasTarjetas = selectAll('.tarjeta-servicio');
  
  for (let i = 0; i < todasLasTarjetas.length; i++) {
    bloques.push(todasLasTarjetas[i]);
    
    let posX, posY;
    
    if (windowWidth <= 768) {
      let col = i % 2;
      let row = Math.floor(i / 2);
      posX = 20 + (col * 200);
      posY = 20 + (row * 170);
    } else {
      posX = 50 + (i * 240);
      posY = 50;
    }
    
    bloques[i].position(posX, posY);
    
    posicionesIniciales.push({
      x: posX,
      y: posY
    });
    
    bloques[i].mousePressed(inicioDrag);
    bloques[i].mouseReleased(finDrag);
  }
}

function draw() {
  background(5, 15, 35);
  
  ambientLight(100);
  pointLight(255, 255, 255, -200, -200, 300);
  pointLight(0, 83, 161, 200, 200, 100);
  
  orbitControl(1, 1, 0.5);
  
  anguloRotacion += 0.3;
  
  for (let i = 0; i < esferas.length; i++) {
    let e = esferas[i];
    
    push();
    translate(e.x, e.y, e.z);
    rotateY(e.rotacion + anguloRotacion);
    rotateX(frameCount * 0.5);
    
    texture(e.textura);
    noStroke();
    sphere(e.radio);
    pop();
  }

  if (drag && bloqueActivo) {
    bloqueActivo.position(mouseX - difX, mouseY - difY);
  }
}

function inicioDrag() {
  drag = true;
  bloqueActivo = this;
  
  bloqueActivo.style('z-index', '10000');
  
  difX = mouseX - bloqueActivo.position().x;
  difY = mouseY - bloqueActivo.position().y;
  
  inicioX = bloqueActivo.position().x;
  inicioY = bloqueActivo.position().y;
}

function finDrag() {
  drag = false;
  
  if (!bloqueActivo || !destino) return;
  
  bloqueActivo.style('z-index', '10');
  
  let bx = bloqueActivo.position().x;
  let by = bloqueActivo.position().y;
  let bancho = bloqueActivo.width;
  let balto = bloqueActivo.height;
  
  let dx = destino.position().x;
  let dy = destino.position().y;
  let dancho = destino.width;
  let dalto = destino.height;
  
  if (bx + bancho > dx && bx < dx + dancho && 
      by + balto > dy && by < dy + dalto) {
    
    destino.style('background-color', '#0053a1');
    destino.style('border', '3px solid white');
    
    let rutaImagen = bloqueActivo.attribute('data-img');
    
    let imgDestino = select('#img-destino');
    imgDestino.attribute('src', rutaImagen);
    imgDestino.style('display', 'block');
    
    let textoDestino = select('#texto-destino');
    textoDestino.style('display', 'none');
    
  } else {
    destino.style('background-color', '#112240');
    destino.style('border', '3px dashed #1e3a5f');
    
    let imgDestino = select('#img-destino');
    imgDestino.style('display', 'none');
    
    let textoDestino = select('#texto-destino');
    textoDestino.style('display', 'block');
  }
  
  let indice = bloques.indexOf(bloqueActivo);
  if (indice !== -1) {
    bloqueActivo.position(posicionesIniciales[indice].x, posicionesIniciales[indice].y);
  }
  
  bloqueActivo = null;
}

function windowResized() {
  const contenedor = document.getElementById('contenedor-3d');
  if (contenedor) {
    const w = contenedor.clientWidth;
    const h = contenedor.clientHeight || 500;
    resizeCanvas(w, h);
  }
  
  for (let i = 0; i < bloques.length; i++) {
    let posX, posY;
    
    if (windowWidth <= 768) {
      let col = i % 2;
      let row = Math.floor(i / 2);
      posX = 20 + (col * 200);
      posY = 20 + (row * 170);
    } else {
      posX = 50 + (i * 240);
      posY = 50;
    }
    
    bloques[i].position(posX, posY);
    posicionesIniciales[i] = { x: posX, y: posY };
  }
}