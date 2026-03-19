document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bgm-audio');
    const controlBtn = document.getElementById('audio-control-btn');
    const tooltip = document.querySelector('.audio-tooltip');

    // Set initial volume
    audio.volume = 0.4;

    let isPlaying = false;

    // Toggle Play/Pause
    controlBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            controlBtn.classList.add('paused');
            tooltip.textContent = 'Play Music';
        } else {
            // Promise handling for play() which can be blocked by browsers
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    controlBtn.classList.remove('paused');
                    tooltip.textContent = 'Pause Music';
                })
                    .catch(error => {
                        console.log("Playback prevented or error:", error);
                    });
            }
        }
        isPlaying = !isPlaying;
    });

    // Autoplay removed as per user request. 
    // Music is now strictly opt-in via the button.
});
