document.addEventListener('DOMContentLoaded', function() {
  const videoOverlay = document.createElement('div');
  videoOverlay.id = 'video-overlay';
  document.getElementById('video-background').appendChild(videoOverlay);
  var terminalContainer = document.getElementById('terminal');
  var terminalText = document.getElementById('terminal-text');
  var videoBackground = document.getElementById('myVideo');
  var closeButton = document.getElementById('close-button');

  var terminalTextContent = [
      "rei_plugins // lyzos.tech",
      "IP: Loading...",
      "System: Loading...",
      "Views: Loading...",
      "Bio Loaded",
      "Press Enter/Click To Continue",
  ];
  var currentIndex = 0;

  videoBackground.pause();

  function typeWriter() {
      var line = currentIndex === 0 ? getAsciiArt() : terminalTextContent[currentIndex - 1];
      var i = 0;

      function typeChar() {
          if (i < line.length) {
              terminalText.textContent += line.charAt(i);
              i++;
              setTimeout(typeChar, currentIndex === 0 ? 10 : 50);
          } else {
              terminalText.textContent += "\n";
              currentIndex++;
              if (currentIndex < terminalTextContent.length + 1) {
                  typeWriter();
              } else {
                  addEventListeners();
              }
          }
      }

      if (currentIndex === 0) {
          terminalText.style.transform = 'scale(5)';
          terminalText.style.opacity = '0';
          terminalText.style.transition = 'transform 1.5s ease-out, opacity 1.5s ease-out';
          void terminalText.offsetWidth;
          
          terminalText.style.transform = 'scale(1)';
          terminalText.style.opacity = '1';
      }

      typeChar();
  }

  function handleInput() {
      terminalContainer.style.display = 'none';
      const video = document.getElementById('myVideo');
      video.muted = false;
      video.volume = 0.5; // Громкость 50%
      video.play();
      document.getElementById('blurred-box').style.display = 'block';
      document.getElementById('music-controls').style.display = 'flex';
      removeEventListeners();
      document.body.classList.add('video-normal');
      window.MusicPlayer.start()
  }

  function addEventListeners() {
      document.addEventListener('keydown', handleKeyPress);
      terminalContainer.addEventListener('click', handleInput);
  }

  function removeEventListeners() {
      document.removeEventListener('keydown', handleKeyPress);
      terminalContainer.removeEventListener('click', handleInput);
  }

  function handleKeyPress(event) {
      if (event.key === 'Enter') {
          handleInput();
      }
  }

  closeButton.addEventListener('click', function() {
      handleInput();
  });

  const ipPromise = fetch("https://api.ipify.org?format=json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch IP address");
      }
      return response.json();
    })
    .then(data => "IP: " + (data.ip || "Unknown"))
    .catch(error => {
      console.error("IP Fetch Error:", error.message);
      return "IP: Unable to fetch IP address";
    });

  const viewsPromise = (window.LyzosViews ? window.LyzosViews.increment() : Promise.resolve(null))
    .then(count => "Views: " + (count !== null && count !== undefined ? count : "N/A"))
    .catch(() => "Views: N/A");

  Promise.all([ipPromise, viewsPromise]).then(([ipLine, viewsLine]) => {
    terminalTextContent[1] = ipLine;
    terminalTextContent[3] = viewsLine;
    typeWriter();
  });

  var userAgent = navigator.userAgent;
  
  function getOperatingSystem() {
      if (userAgent.match(/Windows/)) {
          return getWindowsVersion();
      } else if (userAgent.match(/Macintosh/)) {
          return getMacOSVersion();
      } else if (userAgent.match(/Linux/)) {
          return "Linux";
      } else if (userAgent.match(/Android/)) {
          return getAndroidVersion();
      } else if (userAgent.match(/iPhone|iPad|iPod/)) {
          return getiOSVersion();
      } else {
          return "Unknown";
      }
  }
  
  function getWindowsVersion() {
  const version = userAgent.match(/Windows NT ([\d.]+)/);

  // Nếu không khớp chuỗi
  if (!version) return "Windows";

  const rawVersion = version[1];

  // Dùng thêm logic để phân biệt Windows 11
  if (rawVersion === "10.0") {
    // Nếu có thêm điều kiện như userAgent chứa "Win64; x64"
    if (navigator.userAgent.includes("Win64") && navigator.userAgent.includes("Windows NT 10.0")) {
      return "Windows 11";
    }
    return "Windows 10";
  }

  switch (rawVersion) {
    case "5.1": return "Windows XP";
    case "6.0": return "Windows Vista";
    case "6.1": return "Windows 7";
    case "6.2": return "Windows 8";
    case "6.3": return "Windows 8.1";
    default: return "Windows";
  }
}
  
  function getMacOSVersion() {
    const userAgent = navigator.userAgent || "";
    const match = userAgent.match(/Mac OS X ([\d_]+)/);
    if (match && match[1]) {
        const version = match[1].replace(/_/g, ".");
        return "macOS " + version;
     }
    return "macOS";
 }

  
  function getAndroidVersion() {
    const userAgent = navigator.userAgent || "";
    const match = userAgent.match(/Android ([\d.]+)/);
    if (match && match[1]) {
        return "Android " + match[1];
    }
    return "Android";
 }

  
  function getiOSVersion() {
    const userAgent = navigator.userAgent || "";
    const match = userAgent.match(/(iPhone|iPad).*OS ([\d_]+)/);
    if (match && match[2]) {
        const version = match[2].replace(/_/g, ".");
        return "iOS " + version;
    }
    return "iOS";
 }

  
    // Хардкодим System — всегда Arch Linux, вне зависимости от реального устройства.
    terminalTextContent[2] = "System: Arch Linux";

    // Hàm căn giữa giao diện terminal
    function centerTerminal() {
    if (!terminalContainer) return;

    const terminalWidth = terminalContainer.offsetWidth;
    const terminalHeight = terminalContainer.offsetHeight;
    const centerX = (window.innerWidth - terminalWidth) / 2;
    const centerY = (window.innerHeight - terminalHeight) / 2;

    terminalContainer.style.position = "absolute";
    terminalContainer.style.left = `${centerX}px`;
    terminalContainer.style.top = `${centerY}px`;
    }
    // Căn giữa terminal khi trang được tải và khi thay đổi kích thước
  centerTerminal();
  window.addEventListener('resize', centerTerminal);

  terminalText.style.textAlign = 'center';

  function getAsciiArt() {
      return `
    ⡟⠛⠻⠛⠻⣿⣿⡿⠛⠉⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⡇⠐⡀⠂⢁⠟⢁⣠⣶⣿⡄⢹⣿⣿⣿⣿⣿⠿⠿⠛⣉⣉⡄⢹
    ⣿⣦⣄⡕⠁⣴⣿⣿⣿⡿⢋⣀⣤⡤⢀⠄⣤⣶⣾⣿⣿⣿⡇⠀
    ⣿⣿⡟⢠⣾⣿⣿⣿⣿⠁⢆⣾⣿⡁⢎⣾⣿⣿⣿⣿⣿⣿⡇⢠
    ⡿⠟⢠⣿⠟⠻⣿⣿⣿⣿⣾⣿⣿⣶⣾⣿⣿⣿⣿⣿⣿⣿⠃⣸
    ⡆⢻⣿⡿⠖⠀⠈⢻⣿⢻⣿⣿⣿⣷⣟⠿⠟⠛⠙⢿⣿⣿⠀⣿
    ⢁⣾⣿⣇⣤⣴⣾⣿⣿⣮⣭⣬⣭⣾⣧⢄⠀⠒⢶⣿⣿⣿⠧⠘
    ⠀⣿⠛⠡⠂⠀⡀⠈⠙⠟⠉⠉⠀⠀⢍⠺⣷⣦⣾⣿⣿⣿⣦⡉
    ⣧⠘⣈⣤⡀⠁⠄⡈⠄⡀⠂⠌⢐⣀⣀⠱⠘⣟⡿⣿⣿⣶⠉⣴
    ⡟⢰⣿⣿⣿⠀⠚⠄⠠⠐⢀⠂⣿⣿⣿⣿⣶⣬⡺⣹⢲⡞⠆⢹
    ⡇⢸⣿⣿⣟⠀⠀⠂⠁⠀⣂⠀⠹⣿⢿⣿⣿⣿⣿⣷⣭⡀⢴⣿
    ⣷⡌⠻⡿⠋⠄⠀⠀⠀⠐⠀⠃⠀⠙⢷⣿⣿⣿⣿⣾⣿⣿⣦⡙ 
  `;
  }

  document.body.classList.remove('video-normal');
  videoOverlay.style.display = 'block'; 
}); 