const songs = [
    // "background.mp3" // Отключено, так как используется звук из видео
];

let currentSongIndex = 0;
let isPlaying = false;
let hasPlayableSong = false;
const audio = new Audio();

audio.volume = 0.3;

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

let shuffledSongs = shuffleArray(songs);

async function songExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

async function initMusicPlayer() {
    hasPlayableSong = await songExists(`./media/${shuffledSongs[currentSongIndex]}`);

    const controls = document.getElementById('music-controls');
    if (!hasPlayableSong) {
        // Трека нет в media/ — прячем плеер вместо того, чтобы спамить
        // "NotSupportedError" в консоли на каждую попытку play().
        if (controls) controls.style.display = 'none';
        console.debug('LyzosMusic: файл трека не найден в media/, плеер скрыт. Добавь свой mp3 и пропиши имя в js/music.js.');
        return;
    }

    loadSong(currentSongIndex);
    audio.addEventListener('ended', nextSong);
}

function startMusicAfterTerminal() {
    if (!hasPlayableSong) return;
    isPlaying = true;
    audio.play()
        .catch(error => {
            console.debug("Music playback error:", error.message);
        });
}

function loadSong(index) {
    if (!hasPlayableSong) return;
    audio.src = `./media/${shuffledSongs[index]}`;

    if (isPlaying) {
        audio.play().catch(error => console.debug("Play error:", error.message));
    }
}

function nextSong() {
    if (!hasPlayableSong) return;
    currentSongIndex = Math.floor(Math.random() * shuffledSongs.length);
    loadSong(currentSongIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    shuffledSongs = shuffleArray([...songs]);
    initMusicPlayer();
});

window.MusicPlayer = {
    start: startMusicAfterTerminal,
    getAudio: () => audio
};