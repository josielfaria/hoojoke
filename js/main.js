function Background(x, y, largura, altura) {
  this.x = x;
  this.y = y;
  this.largura = largura;
  this.altura = altura;
  this.desenha = function (xCanvas, yCanvas) {
    ctx.drawImage(
      background,
      this.x,
      this.y,
      this.largura,
      this.altura,
      xCanvas,
      yCanvas,
      this.largura,
      this.altura
    );
  };
}

function Score(x, y, largura, altura) {
  this.x = x;
  this.y = y;
  this.largura = largura;
  this.altura = altura;
  this.desenha = function (xCanvas, yCanvas) {
    ctx.drawImage(
      scoreSprite,
      this.x,
      this.y,
      this.largura,
      this.altura,
      xCanvas,
      yCanvas,
      this.largura,
      this.altura
    );
  };
}

function NewScore(x, y, largura, altura) {
  this.x = x;
  this.y = y;
  this.largura = largura;
  this.altura = altura;
  this.desenha = function (xCanvas, yCanvas) {
    ctx.drawImage(
      newScoreSprite,
      this.x,
      this.y,
      this.largura,
      this.altura,
      xCanvas,
      yCanvas,
      this.largura,
      this.altura
    );
  };
}

function Start(x, y, largura, altura) {
  this.x = x;
  this.y = y;
  this.largura = largura;
  this.altura = altura;
  this.desenha = function (xCanvas, yCanvas) {
    ctx.drawImage(
      startSprite,
      this.x,
      this.y,
      this.largura,
      this.altura,
      xCanvas,
      yCanvas,
      this.largura,
      this.altura
    );
  };
}

function Grass(x, y, largura, altura) {
  this.x = x;
  this.y = y;
  this.largura = largura;
  this.altura = altura;
  this.desenha = function (xCanvas, yCanvas) {
    ctx.drawImage(
      grassSprite,
      this.x,
      this.y,
      this.largura,
      this.altura,
      xCanvas,
      yCanvas,
      this.largura,
      this.altura
    );
  };
}

function CharSprite(x, y, largura, altura) {
  this.x = x;
  this.y = y;
  this.largura = largura;
  this.altura = altura;
  this.desenha = function (xCanvas, yCanvas) {
    ctx.drawImage(
      characterSprite,
      this.x,
      this.y,
      this.largura,
      this.altura,
      xCanvas,
      yCanvas,
      this.largura,
      this.altura
    );
  };
}

function Trap(x, y, largura, altura) {
  this.x = x;
  this.y = y;
  this.largura = largura;
  this.altura = altura;
  this.desenha = function (xCanvas, yCanvas) {
    ctx.drawImage(
      trapSprite,
      this.x,
      this.y,
      this.largura,
      this.altura,
      xCanvas,
      yCanvas,
      this.largura,
      this.altura
    );
  };
}

// CONFIG CANVAS
let bg = new Background(0, 0, 2000, 2000);
let character = new CharSprite(0, 0, 150, 150);
let perdeu = new Score(0, 0, 2000, 2000);
let start = new Start(0, 0, 2000, 2000);
let recordnew = new NewScore(0, 0, 2000, 2000);
let grama = new Grass(0, 0, 2000, 2000);
let trap = new Trap(0, 0, 95, 70);

let canvas,
  ctx,
  ALTURA,
  LARGURA,
  frame = 0,
  maxPulos = 3,
  velocidade = 5,
  estadoAtual,
  record,
  img,
  backgroundRandom = Math.floor(Math.random() * 4) + 1,
  estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2,
  },
  chao = {
    y: 557,
    altura: 2,
    cor: "#60330c",
    desenha: function () {
      grama.desenha(0, 0, LARGURA, this.altura);
    },
  },
  bloco = {
    x: 50,
    y: 150,
    altura: character.altura,
    largura: character.largura,
    cor: "#0b0b0b",
    gravidade: 1.5,
    velocidade: 0,
    forcaDoPulo: 29,
    qtdPulos: 0,
    pulando: false,
    animando: false,
    score: 0,
    atualiza: function () {
      this.velocidade += this.gravidade;
      this.y += this.velocidade;
      if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) {
        this.y = chao.y - this.altura + 10;
        this.qtdPulos = 0;
        this.velocidade = 0;
        this.pulando = false;
        if (estadoAtual == estados.jogando) animeCharacterSpriteRun();
      }
    },
    pula: function () {
      if (this.qtdPulos < maxPulos) {
        jump.play();
        this.pulando = true;
        this.velocidade = -this.forcaDoPulo;
        this.qtdPulos++;
        animeCharacterSpriteJump();
      }
    },
    reset: function () {
      this.velocidade = 0;
      this.y = 0;
      if (this.score > record) {
        localStorage.setItem("record", this.score);
        record = this.score;
      }
      this.score = 0;
    },
    desenha: function (xCanvas, yCanvas) {
      character.desenha(this.x, this.y);
    },
  },
  obstaculos = {
    _obs: [],
    cores: ["#e81111", "#fff", "#0027fc", "#e1f407", "#f00194", "#000"],
    tempoInsere: 0,
    insere: function () {
      this._obs.push({
        x: LARGURA,
        largura: 50,
        altura: 150,
        cor: this.cores[Math.floor(6 * Math.random())],
      });
      this.tempoInsere = 50 + Math.floor(30 * Math.random());
    },

    atualiza: function () {
      if (this.tempoInsere == 0) this.insere();
      else this.tempoInsere--;
      for (var i = 0, tam = this._obs.length; i < tam; i++) {
        var obs = this._obs[i];
        obs.x -= velocidade;
        if (
          bloco.x < obs.x + obs.largura &&
          bloco.x + (bloco.largura - 50) >= obs.x &&
          bloco.y + (bloco.altura + 50) >= chao.y - obs.altura
        ) {
          estadoAtual = estados.perdeu;
        } else if (obs.x == 0) {
          bloco.score++;
        } else if (obs.x <= -obs.largura) {
          this._obs.splice(i, 1);
          tam--;
          i--;
        }
      }
    },
    limpa: function () {
      this._obs = [];
    },
    desenha: function () {
      for (var i = 0, tam = this._obs.length; i < tam; i++) {
        var obs = this._obs[i];
        trap.desenha(obs.x, chao.y - 65, obs.largura, obs.altura);
      }
    },
  };

let posCharacterSpriteJump = 0;
let posCharacterSpriteRun = 0;
let posTrapSprite = 0;

function animeCharacterSpriteJump() {
  if (bloco.pulando) {
    posCharacterSpriteJump++;

    let posX = posCharacterSpriteJump * 150 - 150;
    character = new CharSprite(posX, 150, 150, 150);

    setTimeout(() => {
      requestAnimationFrame(animeCharacterSpriteJump);
    }, 60);

    if (posCharacterSpriteJump == 9) posCharacterSpriteJump = 0;
  }
}

function animeCharacterSpriteRun() {
  if (!bloco.animando && !bloco.pulando) {
    bloco.animando = true;
    posCharacterSpriteRun++;

    let posX = posCharacterSpriteRun * 150 - 150;
    character = new CharSprite(posX, 0, 150, 150);

    setTimeout(() => {
      requestAnimationFrame(animeCharacterSpriteRun);
      bloco.animando = false;
    }, 60);

    if (posCharacterSpriteRun == 9) posCharacterSpriteRun = 0;
  }
}

function animeTrapSprite() {
  posTrapSprite++;

  let posX = posTrapSprite * 95 - 95;
  trap = new Trap(posX, 0, 95, 70);

  setTimeout(() => {
    requestAnimationFrame(animeTrapSprite);
  }, 100);

  if (posTrapSprite == 5) posTrapSprite = 0;
}

function clique(evt) {
  if (estadoAtual == estados.jogando) {
    bloco.pula();
  } else if (estadoAtual == estados.jogar) {
    stopMusic("death");
    theme.play();
    estadoAtual = estados.jogando;
    console.log("estadoAtual", estadoAtual);
    (backgroundRandom = Math.floor(Math.random() * 4) + 1),
      (background.src = `assets/backgrounds/level${backgroundRandom}.png`);
    grassSprite.src = `assets/backgrounds/level${backgroundRandom}-grass.png`;
  } else if (estadoAtual == estados.perdeu && bloco.y >= 10 * ALTURA) {
    estadoAtual = estados.jogar;
    obstaculos.limpa();
    bloco.velocidade = 0;
    bloco.reset();
  }
}

function main() {
  ALTURA = window.innerHeight;
  LARGURA = window.innerWidth;
  if (LARGURA >= 500) {
    LARGURA = 1060;
    ALTURA = 600;
  }
  canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  canvas.style.border = "5px solid #000";
  ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  document.addEventListener("mousedown", clique);
  document.addEventListener("mousedown", clique);
  window.addEventListener("keypress", function (e) {
    var codigoTecla = e.which || e.keyCode || 0;
    var space = codigoTecla == 32;
    if (space) clique();
  });
  estadoAtual = estados.jogar;
  record = localStorage.getItem("record");
  if (record == null) {
    record = 0;
  }
  img = new Image();
  img.src = "assets/image.png";
  startSprite = new Image();
  startSprite.src = "assets/start.svg";
  characterSprite = new Image();
  characterSprite.src = "assets/character/character.png";
  background = new Image();
  background.src = `assets/backgrounds/level1.png`;
  grassSprite = new Image();
  grassSprite.src = `assets/backgrounds/level1-grass.png`;
  trapSprite = new Image();
  trapSprite.src = "assets/traps.png";
  scoreSprite = new Image();
  scoreSprite.src = "assets/score.svg";
  newScoreSprite = new Image();
  newScoreSprite.src = "assets/new-score.svg";
  roda();
  animeTrapSprite();
}

function desenha() {
  bg.desenha(0, 0);
  if (estadoAtual == estados.perdeu) {
    perdeu.desenha(0, 0, 2000, 2000);
    stopMusic("theme");
    setTimeout(() => death.play(), 0);
    setTimeout(() => stopMusic("death"), 13500);
    ctx.fillStyle = "#e1f407";
    ctx.font = "90px Londrina Solid";
    if (bloco.score >= 10) {
      if (bloco.score >= 100) {
        ctx.fillText(bloco.score, LARGURA / 2 - -60, ALTURA / 2 - -120);
      } else {
        ctx.fillText(bloco.score, LARGURA / 2 - -70, ALTURA / 2 - -120);
      }
    } else {
      ctx.fillText(bloco.score, LARGURA / 2 - -80, ALTURA / 2 - -120);
    }
    ctx.font = "40px Londrina Solid";
    ctx.fillStyle = "#FFF";
    if (record >= 10) {
      if (bloco.score >= 100) {
        ctx.fillText(record, LARGURA / 2 - 20, ALTURA / 2 - -12);
      } else {
        ctx.fillText(record, LARGURA / 2 - 30, ALTURA / 2 - -12);
      }
    } else {
      ctx.fillText(record, LARGURA / 2 - 40, ALTURA / 2 - -12);
    }
    if (bloco.score > record) {
      recordnew.desenha(0, 0, 2000, 2000);
    }
  } else if (estadoAtual == estados.jogando) {
    obstaculos.desenha();
    // ctx.shadowColor = "black";
    // ctx.shadowBlur = 5;
    // ctx.lineWidth = 5;
    bloco.desenha();
    ctx.fillStyle = "#e1f407";
    ctx.font = "100px Londrina Solid";
    if (bloco.score >= 10) {
      if (bloco.score >= 100) {
        ctx.fillText(bloco.score, 910, 100);
      } else {
        ctx.fillText(bloco.score, 920, 100);
      }
    } else {
      ctx.fillText(bloco.score, 930, 100);
    }
  }
  obstaculos.desenha();
  chao.desenha();
  bloco.desenha();

  if (estadoAtual == estados.jogar) {
    start.desenha(0, 0, 2000, 2000);
  }
}

function roda() {
  atualiza();
  desenha();
  window.requestAnimationFrame(roda);
}

function atualiza() {
  frame++;
  bloco.atualiza();
  if (estadoAtual == estados.jogando) {
    obstaculos.atualiza();
  }
}

function barraEspaço(evt) {
  bloco.pula();
}
main();
