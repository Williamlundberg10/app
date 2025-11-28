const ui = (() => {

  // ✅ Inject CSS ONCE
  if (!document.getElementById("ui-popup-style")) {
    const style = document.createElement("style");
    style.id = "ui-popup-style";
    style.textContent = `
      .popup-overlay {
        transition: opacity 0.3s;
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        background: rgba(0,0,0,0.2);
        opacity: 1;
        z-index: 1000;
      }

      .popup-overlay.show {
        opacity: 1;
      }

      .popup-box {
        background: white;
        border-radius: 52px 52px 0 0;
        width: 100%;
        height: 100%;
        box-shadow: 0px -18px 100px rgba(0, 0, 0, 0.48);
        transform: translateY(100%);
        transition: transform 0.3s;
        position: relative;
      }

      .popup-box.q1 {
        transform: translateY(25%);
        transition: transform 0.3s;
      }

      .popup-box.closing {
        transform: translateY(100%);
        transition: transform 0.3s;
      }

      .popup-close {
        position: absolute;
        top: 12px;
        right: 20px;
        background: transparent;
        border: none;
        font-size: 26px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  async function popUp(fileOrHtml, Data_j, options = {}) {
    let htmlData = "";

    const isFile =
      typeof fileOrHtml === "string" &&
      (fileOrHtml.endsWith(".html") || fileOrHtml.startsWith("http"));

    if (isFile) {
      try {
        const res = await fetch(fileOrHtml);
        htmlData = await res.text();
      } catch {
        htmlData = `<p style="color:red;">Error loading ${fileOrHtml}</p>`;
      }
    } else {
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

    function add_data(container) {
      const dataScript = document.createElement("script");
      dataScript.textContent = `window.data_json = ${JSON.stringify(Data_j)};`;
      container.prepend(dataScript);
    }

    function runScripts(container) {
      const scripts = container.querySelectorAll("script");
      scripts.forEach(oldScript => {
        if (!oldScript.src && !oldScript.textContent.trim()) return;

        const newScript = document.createElement("script");
        if (oldScript.src) {
          newScript.src = oldScript.src;
          newScript.defer = true;
        } else {
          newScript.textContent = oldScript.textContent;
        }

        document.body.appendChild(newScript);
        document.body.removeChild(newScript);
      });
    }

    function closePopup() {
      box.classList.remove("q1");
      box.classList.add("closing");
      overlay.classList.remove("show");

      const cleanup = () => {
        overlay.remove();
        options.onClose?.();
      };

      box.addEventListener("transitionend", cleanup, { once: true });

      // ✅ fallback if transitionend fails
      setTimeout(cleanup, 350);
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    closeBtn.onclick = e => {
      e.stopPropagation();
      closePopup();
    };

    box.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    requestAnimationFrame(async () => {
      overlay.classList.add("show");
      box.className = "popup-box"
      await wait(100);
      box.classList.add("q1");

      add_data(box);
      runScripts(box);

      options.onOpen?.();
    });

    if (options.closeOnBackground !== false) {
      overlay.onclick = e => {
        if (e.target === overlay) closePopup();
      };
    }
  }

  return { popUp };
})();
