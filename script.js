
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. DOM ELEMENTS
    // ==========================================

    const startOverlay = document.getElementById("start-overlay");
    const startAppBtn = document.getElementById("start-app-btn");

    const video1 = document.getElementById("videoPlayer1");
    const video2 = document.getElementById("videoPlayer2");

    const langOverlay = document.getElementById("language-overlay");
    const scene4Overlay = document.getElementById("scene4-overlay");
    const settingsOverlay = document.getElementById("settings-overlay");

    const btnBm = document.getElementById("btn-bm");
    const btnEn = document.getElementById("btn-en");
    const skipBtn = document.getElementById("skip-btn");

    const btnChapter = document.getElementById("btn-chapter");
    const btnQuiz = document.getElementById("btn-quiz");

    const settingsBtn = document.getElementById("settings-btn");
    const homeBtn = document.getElementById("home-btn");
    const backBtn = document.getElementById("back-btn");

    const settingsTitle = document.getElementById("settings-title");
    const labelAudio = document.getElementById("label-audio");
    const labelLanguage = document.getElementById("label-language");

    const textVolumeUp = document.getElementById("text-volume-up");
    const textVolumeDown = document.getElementById("text-volume-down");
    const textMute = document.getElementById("text-mute");

    const textLangBm = document.getElementById("text-lang-bm");
    const textLangEn = document.getElementById("text-lang-en");

    const volumeSlider = document.getElementById("volume-slider");
    const volumePercentage = document.getElementById("volume-percentage");

    const btnVolumeUp = document.getElementById("btn-volume-up");
    const btnVolumeDown = document.getElementById("btn-volume-down");
    const btnMute = document.getElementById("btn-mute");

    const btnSetBm = document.getElementById("btn-set-bm");
    const btnSetEn = document.getElementById("btn-set-en");


    // ==========================================
    // 2. FILE PATHS - GITHUB ROOT
    // ==========================================

    const FILES = {
        video1: "Comp1.mp4",
        video2: "full-intro.mp4",
        bgm: "bgm.mp3",
        introBm: "intro.MP3",
        introEn: "intro eng.MP3"
    };

    // Set video paths directly
    video1.pause();
    video2.pause();

    video1.src = FILES.video1;
    video2.src = FILES.video2;

    video1.preload = "auto";
    video2.preload = "auto";

    video1.load();
    video2.load();

    // ==========================================
    // 3. STATE & BACKGROUND MUSIC
    // ==========================================

    let selectedLang = "ms";
    let introAudio = null;
    let previousScene = "scene4";

    const bgMusic = new Audio(FILES.bgm);
    bgMusic.loop = true;

    const initialVolume = volumeSlider
        ? Number(volumeSlider.value)
        : 50;

    bgMusic.volume = initialVolume / 100;

    function playBGM() {
        bgMusic.play().catch(error => {
            console.error("BGM error:", error);
        });
    }

    function stopIntroAudio() {
        if (introAudio) {
            introAudio.pause();
            introAudio.currentTime = 0;
            introAudio = null;
        }
    }


    // ==========================================
    // 4. START BUTTON - FIRST VIDEO
    // ==========================================

    startAppBtn.addEventListener("click", async () => {

        console.log("START clicked");

        startOverlay.style.display = "none";

        langOverlay.style.display = "none";
        scene4Overlay.style.display = "none";
        settingsOverlay.style.display = "none";

        video2.pause();
        video2.classList.remove("active");

        video1.classList.add("active");
        video1.style.display = "block";

        video1.currentTime = 0;

        playBGM();

        try {
            await video1.play();
            console.log("Comp1.mp4 playing successfully");
        } catch (error) {
            console.error("Video 1 error:", error);
            alert("Video pertama gagal dimainkan. Semak Comp1.mp4.");
        }
    });

    video1.addEventListener("ended", () => {

        console.log("Video 1 ended");

        video1.pause();
        video1.classList.remove("active");
        video1.style.display = "none";

        langOverlay.style.display = "flex";
    });


    // ==========================================
    // 5. LANGUAGE SELECTION
    // ==========================================

    btnBm.addEventListener("click", () => {
        startIntroScene("ms");
    });

    btnEn.addEventListener("click", () => {
        startIntroScene("en");
    });

    async function startIntroScene(lang) {

        selectedLang = lang;
        updateLocalizationUI();

        langOverlay.style.display = "none";
        scene4Overlay.style.display = "none";

        skipBtn.style.display = "flex";

        stopIntroAudio();

        const audioFile = selectedLang === "en"
            ? FILES.introEn
            : FILES.introBm;

        introAudio = new Audio(audioFile);
        introAudio.volume = 1;
        introAudio.preload = "auto";

        video1.pause();
        video1.classList.remove("active");
        video1.style.display = "none";

        video2.classList.add("active");
        video2.style.display = "block";

        video2.currentTime = 0;
        introAudio.currentTime = 0;

        try {
            await Promise.all([
                video2.play(),
                introAudio.play()
            ]);

            console.log("Intro video and audio playing");
        } catch (error) {
            console.error("Intro playback error:", error);
        }
    }


    // ==========================================
    // 6. SKIP & SCENE 4
    // ==========================================

    video2.addEventListener("ended", goToScene4);

    skipBtn.addEventListener("click", goToScene4);

    function goToScene4() {

        stopIntroAudio();

        video2.pause();
        video2.classList.remove("active");
        video2.style.display = "none";

        skipBtn.style.display = "none";

        langOverlay.style.display = "none";

        updateLocalizationUI();

        scene4Overlay.style.display = "flex";
    }


    // ==========================================
    // 7. SETTINGS NAVIGATION
    // ==========================================

    settingsBtn.addEventListener("click", () => {

        previousScene = "scene4";

        scene4Overlay.style.display = "none";
        settingsOverlay.style.display = "flex";
    });

    backBtn.addEventListener("click", () => {

        settingsOverlay.style.display = "none";

        if (previousScene === "scene4") {
            scene4Overlay.style.display = "flex";
        }
    });

    homeBtn.addEventListener("click", () => {

        settingsOverlay.style.display = "none";
        scene4Overlay.style.display = "flex";
    });


    // ==========================================
    // 8. VOLUME CONTROLS
    // ==========================================

    function setVolume(value) {

        const clampedValue = Math.max(
            0,
            Math.min(100, Number(value))
        );

        volumeSlider.value = clampedValue;
        volumePercentage.textContent = clampedValue + "%";

        volumeSlider.style.background =
            `linear-gradient(to right,
            #E70B90 ${clampedValue}%,
            #FFCCE5 ${clampedValue}%)`;

        bgMusic.volume = clampedValue / 100;
    }

    setVolume(initialVolume);

    volumeSlider.addEventListener("input", event => {
        setVolume(event.target.value);
    });

    btnVolumeUp.addEventListener("click", () => {
        setVolume(Number(volumeSlider.value) + 10);
    });

    btnVolumeDown.addEventListener("click", () => {
        setVolume(Number(volumeSlider.value) - 10);
    });

    btnMute.addEventListener("click", () => {
        setVolume(0);
    });


    // ==========================================
    // 9. SETTINGS LANGUAGE BUTTONS
    // ==========================================

    btnSetBm.addEventListener("click", () => {
        selectedLang = "ms";
        updateLocalizationUI();
    });

    btnSetEn.addEventListener("click", () => {
        selectedLang = "en";
        updateLocalizationUI();
    });


    // ==========================================
    // 10. LANGUAGE TRANSLATIONS
    // ==========================================

    function updateLocalizationUI() {

        if (selectedLang === "en") {

            settingsTitle.textContent = "Setting";
            labelAudio.textContent = "Sound";
            labelLanguage.textContent = "Language";

            textVolumeUp.textContent = "Volume Up";
            textVolumeDown.textContent = "Volume Down";
            textMute.textContent = "Mute";

            textLangBm.textContent = "Malay";
            textLangEn.textContent = "English";

            backBtn.textContent = "Back";

            btnChapter.textContent = "Chapter";
            btnQuiz.textContent = "Quiz";
            skipBtn.textContent = "Skip";

        } else {

            settingsTitle.textContent = "Tetapan";
            labelAudio.textContent = "Audio";
            labelLanguage.textContent = "Bahasa";

            textVolumeUp.textContent = "Kuatkan";
            textVolumeDown.textContent = "Perlahankan";
            textMute.textContent = "Senyap";

            textLangBm.textContent = "Bahasa Melayu";
            textLangEn.textContent = "Bahasa Inggeris";

            backBtn.textContent = "Kembali";

            btnChapter.textContent = "Bab";
            btnQuiz.textContent = "Kuiz";
            skipBtn.textContent = "Langkau";
        }
    }

    updateLocalizationUI();


    // ==========================================
    // 11. VIDEO ERROR DETECTION
    // ==========================================

    video1.addEventListener("error", () => {
        console.error(
            "Comp1.mp4 failed:",
            video1.error
        );
    });

    video2.addEventListener("error", () => {
        console.error(
            "full-intro.mp4 failed:",
            video2.error
        );
    });

});
