const theme = new Audio("assets/music/theme.mp3");
theme.volume = 0.05;

const death = new Audio("assets/music/death.mp3");
death.volume = 0.2;

const hurt = new Audio("assets/music/hurt.mp3");
hurt.volume = 0.05;

const jump = new Audio("assets/music/jump.mp3");
jump.volume = 0.5;

stopMusic = (audioName) => {
  switch (audioName) {
    case "theme":
      theme.pause();
      theme.currentTime = 0;
      break;
    case "death":
      death.pause();
      death.currentTime = 0;
      break;
  }
};
