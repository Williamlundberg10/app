const ui = (() => {
  // Inject CSS once
  const style = document.createElement("style");
  style.textContent = `
    .popup-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .popup-overlay.show {
      opacity: 1;
    }
    .popup-box {
      background: white;
      padding: 20px;
      border-radius: 12px;
      max-width: 400px;
      width: 80%;
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
      position: fixed;
      transform: translateY(500px);
      transition: transform 0.3s ease;
    }
    .popup-box.q1 {
      transform: translateY(0px);
    }
    .popup-box.closing {
      transform: translateY(500px);
    }
    .popup-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      border: none;
      font-size: 18px;
      cursor: pointer;
    }
  `;
  //document.head.appendChild(style);

  async function popUp(fileOrHtml, options = {}) {
    let htmlData = "";

    // If input looks like a filename/URL, fetch it
    if (fileOrHtml.endsWith(".html") || fileOrHtml.includes("/")) {
      try {
        const res = await fetch(fileOrHtml);
        htmlData = await res.text();
      } catch (err) {
        htmlData = `<p style="color:red;">Error loading ${fileOrHtml}</p>`;
      }
    } else {
      // Treat it as raw HTML
      htmlData = fileOrHtml;
    }

    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    const box = document.createElement("div");
    box.className = "popup-box";
    box.innerHTML = htmlData;

    const closeBtn = document.createElement("button");
    closeBtn.className = "popup-close";
    closeBtn.innerHTML = "&times;";

    function closePopup() {
      box.classList.remove("q1");
      box.classList.add("closing");
      box.addEventListener("transitionend", () => {
        document.body.removeChild(overlay);
      }, { once: true });
    }

    closeBtn.onclick = closePopup;

    requestAnimationFrame(() => {
        console.log("hej")
      box.classList.add("q1");
    });

    box.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    if (options.closeOnBackground !== false) {
      overlay.onclick = (e) => {
        if (e.target === overlay) closePopup();
      };
    }
  }

  return { popUp };
})();
