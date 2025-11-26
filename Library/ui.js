// UI-m Library
const UIM = (function() {
  var offs = 9
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
            width: 80%;
            height: 30px;
            border-radius: 200px;
            border-color: rgba(220, 220, 220, 0.5);
            border-style: solid;
            border-width: 5px;
            background-color: #ffffffcb;
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
            width: calc(20% - 10px);
            height: 75%;
            border-radius: 200px;
            border-color: rgba(220, 220, 220, 1);
            border-style: solid;
            border-width: 3px;
            background-color: #29292902;
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
            color: #000000ff;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            font-family: "Archivo Black", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 25px;
        }
    `;
    document.head.appendChild(style);
  }

  // Function to create a UI-m container
  function create(options = {}) {

    const buttons = options.buttons || ["Button1", "Button2"];
    const cc = options.C_data || "";
    const Z = options.Z + "px" || "15px";
    const Font_S = options.font_S + "px" || "25px";
    const width_joystick = options.width_joystick + "%" || "20%";

    const container = document.createElement("UI-m");
    container.style.bottom = Z
    // Create draggable joystick
    const jf = document.createElement("div");
    jf.classList.add("jf");
    jf.style.width = width_joystick
    container.appendChild(jf);

    // Add buttons with IDs + index
    buttons.forEach((text, index) => {
      const btn = document.createElement("div");
      btn.classList.add("button");
      btn.style.fontSize = Font_S
      btn.textContent = text;
      btn.id = "btn-" + (index + 1);   // btn-1, btn-2...
      btn.dataset.index = index + 1;
      btn.dataset[cc] = "dag_" + (index + 1);
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
      const d = rect.width + offs
      const targetCenterX = rect.left - parentRect.left + rect.width - d / 2;
      console.log("Op", rect.width)
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
        const d = r.width + offs
        const cx = r.left - parentRect.left + r.width - d / 2;
        console.log("oooo", d)
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

