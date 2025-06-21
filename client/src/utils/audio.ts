
export const initBackgroundMusic = () => {
  const audio = document.getElementById('bgMusic') as HTMLAudioElement;
  
  const playMusic = () => {
    audio.volume = 0.1;
    audio.play().catch(() => {
      console.log('Autoplay prevented - waiting for user interaction');
    });
  };

  document.addEventListener('click', () => {
    if (audio.paused) {
      playMusic();
    }
  }, { once: true });
};
