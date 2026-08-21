document.addEventListener('DOMContentLoaded', () => {
    const userId = "975710504720945153"; //replace your discord id here
    const apiUrl = `https://discord-lookup-api-alpha.vercel.app/v1/user/${userId}`;

    const avatarFrame = document.getElementById('avatar-frame');

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.username) {
                window.lyzosDiscordTag = data.discriminator && data.discriminator !== "0"
                    ? `${data.username}#${data.discriminator}`
                    : data.username;
            }

            if (data.avatar_decoration && data.avatar_decoration.asset) {
                const asset = data.avatar_decoration.asset;
                const frameUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png`;
                avatarFrame.src = frameUrl;
                avatarFrame.style.display = 'block';
            } else {
                avatarFrame.style.display = 'none';
            }
        })
        .catch(error => {
            // Не критично — это только декоративная рамка вокруг аватарки.
            // Публичное lookup-API часто 404-ит/лимитит, поэтому просто прячем рамку.
            avatarFrame.style.display = 'none';
            console.debug("Avatar frame lookup skipped:", error.message);
        });
});