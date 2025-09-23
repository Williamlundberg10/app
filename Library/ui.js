// UI-m Library
const UIM = (function() {
  // Inject global CSS (only once)
  if (!document.getElementById("uim-style")) {
    const style = document.createElement("style");
    style.id = "uim-style";
    style.textContent = `
        ui-m{
            position: absolute;
            transition-duration: 0.8s;
            bottom: 15px ;
            display: flex;
            flex-direction: row;
            gap: 10px;
            width: 85%;
            height: 35px;
            border-radius: 200px;
            border-color: rgba(255, 255, 255, 0.47);
            border-style: solid;
            border-width: 3px;
            background-color: #00000093;
            padding: 20px;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }

        .mmmj{
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .jf {
            position: absolute;
            display: flex;
            width: 20%;
            height: 75%;
            border-radius: 200px;
            border-color: rgba(255, 255, 255, 0.47);
            border-style: solid;
            border-width: 3px;
            background-color: #ffffff09;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            cursor: grab;
            transition: left 150ms ease, top 150ms ease; /* smooth snap */
            touch-action: none; /* improve touch dragging */
            user-select: none;
            
        }

        .jf.dragging {
            cursor: grabbing;
            transition: none; /* disable transition while moving */
        }

        .button{
            color: #ffffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            font-size: 70px;
            font-family: "Archivo Black", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 25px;
            margin-right: 5px;
        }
    `;
    document.head.appendChild(style);
  }

  // Function to create a UI-m container
  function create(options = {}) {
    const container = document.createElement("UI-m");

    // Create draggable joystick
    const jf = document.createElement("div");
    jf.classList.add("jf");
    container.appendChild(jf);

    // Add buttons with IDs + index
    const buttons = options.buttons || ["Button1", "Button2"];
    buttons.forEach((text, index) => {
      const btn = document.createElement("div");
      btn.classList.add("button");
      btn.textContent = text;
      btn.id = "btn-" + (index + 1);   // btn-1, btn-2...
      btn.dataset.index = index + 1;   // numeric ID
      container.appendChild(btn);
    });

    // Append to parent or body
    const parent = options.parent || document.body;
    parent.appendChild(container);
    parent.classList.add("mmmj");

    // Helper functions
    const getButtons = () => Array.from(container.querySelectorAll(".button"));

    function addq(target) {
      const rect = target.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      const targetCenterX = rect.left - parentRect.left + rect.width / 2;
      jf.style.left = targetCenterX - jf.offsetWidth / 2 + "px";
    }

    function snapToNearest() {
      const buttons = getButtons();
      if (!buttons.length) return null;

      const parentRect = container.getBoundingClientRect();
      const jfRect = jf.getBoundingClientRect();
      const jfCenterX = jfRect.left - parentRect.left + jfRect.width / 2;
      const jfCenterY = jfRect.top - parentRect.top + jfRect.height / 2;

      let nearest = null;
      let minDist = Infinity;

      buttons.forEach(btn => {
        const r = btn.getBoundingClientRect();
        const cx = r.left - parentRect.left + r.width / 2;
        const cy = r.top - parentRect.top + r.height / 2;
        const dist = Math.hypot(cx - jfCenterX, cy - jfCenterY);
        if (dist < minDist) {
          minDist = dist;
          nearest = { btn, cx, cy };
        }
      });

      if (nearest) {
        jf.style.left = nearest.cx - jf.offsetWidth / 2 + "px";
        return nearest.btn;
      }
      return null;
    }

    // Button click listeners
    getButtons().forEach(btn => {
      btn.addEventListener("click", () => {
        addq(btn);
        if (typeof options.onClick === "function") {
          options.onClick(btn, parseInt(btn.dataset.index, 10));
        }
      });
    });

    // Dragging
    let offsetX = 0, offsetY = 0;
    let isDragging = false;

    jf.addEventListener("pointerdown", (e) => {
      isDragging = true;
      jf.classList.add("dragging");
      offsetX = e.clientX - jf.offsetLeft;
      offsetY = e.clientY - jf.offsetTop;
      jf.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    jf.addEventListener("pointermove", (e) => {
      if (!isDragging) return;

      let newLeft = e.clientX - container.getBoundingClientRect().left - offsetX;
      let newTop = e.clientY - container.getBoundingClientRect().top - offsetY;

      newLeft = Math.max(0, Math.min(container.clientWidth - jf.offsetWidth, newLeft));
      newTop = Math.max(0, Math.min(container.clientHeight - jf.offsetHeight, newTop));

      jf.style.left = newLeft + "px";
    });

    jf.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      jf.classList.remove("dragging");
      try { jf.releasePointerCapture(e.pointerId); } catch {}

      const snappedBtn = snapToNearest();
      if (snappedBtn && typeof options.onRelease === "function") {
        options.onRelease(snappedBtn, parseInt(snappedBtn.dataset.index, 10));
      }
    });

    jf.addEventListener("pointercancel", () => {
      if (!isDragging) return;
      isDragging = false;
      jf.classList.remove("dragging");
      snapToNearest();
    });

    // 👇 Set default button if provided
    if (options.default) {
      const defBtn = container.querySelector(`.button:nth-of-type(${options.default + 1})`);
      if (defBtn) {
        setTimeout(() => addq(defBtn), 0);
      }
    }

    return container;
  }

  return { create };
})();

