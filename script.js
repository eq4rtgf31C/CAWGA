async function downloadCovers() {
    const results = document.getElementById("results");
    results.innerHTML = "";

    let rawLinks = document.getElementById("links").value
        .trim()
        .split("\n")
        .filter(link => link.trim() !== "");
    const links = rawLinks.map(link =>
        link.replace(/а/g, "a").replace(/А/g, "A")
    );

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        try {
            // ✅ Обход CORS через AllOrigins
            const proxy = "https://api.allorigins.win/get?url=";
            const response = await fetch(
                `${proxy}${encodeURIComponent(`https://soundcloud.com/oembed?url=${link}&format=json`)}`
            );
            const json = await response.json();
            const data = JSON.parse(json.contents);

            let imageUrl = data.thumbnail_url.replace("-t500x500", "-t500x500");

            const box = document.createElement("div");
            box.className = "cover-box";
            box.style.transition = "max-height 0.5s ease-in-out, opacity 0.5s ease-in-out";
            box.style.maxHeight = "0";
            box.style.opacity = "0";
            box.innerHTML = `
                <div class="cover-wrapper">
                    <img src="${imageUrl}" alt="cover" style="max-width: 200px; border-radius: 10px; opacity: 0; transition: opacity 0.5s ease-in-out;">
                    <button class="download-btn">Скачать</button>
                </div>
                <p>${data.title}</p>
            `;

            results.appendChild(box);

            const img = box.querySelector("img");
            img.addEventListener("load", () => {
                img.style.opacity = "1";
                box.style.maxHeight = "400px";
                box.style.opacity = "1";
            });

            const btn = box.querySelector(".download-btn");
            btn.addEventListener("click", async () => {
                await downloadImage(imageUrl, sanitizeFileName(data.title) + ".jpg");
            });

        } catch (e) {
            console.error("Ошибка:", e);
            const errorBox = document.createElement("p");
            errorBox.textContent = `Ошибка при загрузке: ${link}`;
            results.appendChild(errorBox);
        }
    }
}

function sanitizeFileName(name) {
    return name.replace(/[<>:"/\\|?*]+/g, '').substring(0, 80);
}

async function downloadImage(url, filename = "cover.jpg") {
    try {
        const resp = await fetch(url);
        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
    } catch (err) {
        alert("Ошибка при скачивании изображения 😢");
        console.error(err);
    }
}
