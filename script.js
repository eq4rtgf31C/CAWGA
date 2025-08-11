async function downloadCovers() {
    const results = document.getElementById("results");
    results.innerHTML = ""; 
    let rawLinks = document.getElementById("links").value.trim().split("\n").filter(link => link.trim() !== "");
    const links = rawLinks.map(link => 
        link.replace(/а/g, "а").replace(/А/g, "A")
    );
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        try {
            const response = await fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(link)}&format=json`);
            const data = await response.json();
            let imageUrl = data.thumbnail_url.replace("-t500x500", "-t500x500")
            const box = document.createElement("div");
            box.className = "cover-box";
            box.style.transition = "max-height 0.5s ease-in-out";
            box.style.maxHeight = "0px";
            box.style.overflow = "hidden";
            box.innerHTML = `
                <div class="cover-wrapper">
                    <img src="${imageUrl}" alt="cover" style="max-width: 200px; transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;" opacity="0">
                    <button1 class="download-btn">Скaчaть</button1>
                </div>
                <p>${data.title}</p>`;
            box.querySelector("img").addEventListener("load", () => {
                box.querySelector("img").style.opacity = "1";
                box.style.maxHeight = "100%";
            });
            box.querySelector(".download-btn").addEventListener("click", () => {
                downloadImage(imageUrl, `cover_${i + 1}.jpg`);
            });
            results.appendChild(box);
        } catch (e) {
            console.error("Ошибка:", e);
            const errorBox = document.createElement("p");
            errorBox.textContent = `Ошибкa при зaгрузке: ${link}`;
            results.appendChild(errorBox);
        }
    }
}

function downloadImage(url, filename = "cover.jpg") {
    fetch(url)
        .then(resp => resp.blob())
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = filename;  
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
        })
        .catch(() => alert("Ошибкa при скачивании изображения"));
}