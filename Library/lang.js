export default class Lang {
  static translations = {};
  static currentLang = "en";
  static folder = "../Language/"; // folder with language files
  static fileExtension = ".json";

  // Load a language file automatically by its code
  static async load(lang = "en") {
    const url = `${this.folder}${lang}${this.fileExtension}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Could not load ${url}`);
      this.translations = await res.json();
      this.currentLang = lang;
      this.update();
    } catch (err) {
      console.error(err);
    }
  }

  // Set language (loads file automatically)
  static async set(lang) {
    await this.load(lang);
    localStorage.setItem("ll1", lang); // remember the language
  }

  // Get translation for a key (uses current language)
  static get(key) {
    return this.translations[key] ?? key;
  }

  // Update all elements with data-i18n
  static update() {
    document.querySelectorAll("[data-ll]").forEach(el => {
      const key = el.getAttribute("data-ll");
      const translated = this.get(key);
      if (translated !== undefined) el.textContent = translated;
    });
  }

  // Initialize with saved language or default
  static async init(defaultLang = "sv") {
    const lang = localStorage.getItem("ll1") || defaultLang;
    await this.set(lang);
  }
}
