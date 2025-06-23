(function () {
  const plugin = {
    init: function () {
      this.injectScript();
      this.injectStyle();
      this.setupHTML();
      this.setupTranslateFunction();
    },

    injectScript: function () {
      if (document.getElementById("google-translate-script")) return;

      const script = document.createElement("script");
      script.defer = true;
      script.type = "text/javascript";
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.head.appendChild(script);

      // Setup the init function globally
      window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: true
        }, 'google_translate_element');
      };
    },

    injectStyle: function () {
      const css = `
/* Google Translate Styling */
.skiptranslate { display: none !important; }
body { top: 0px !important; }
font { all: unset !important; }
      `;
      const style = document.createElement("style");
      style.innerHTML = css;
      document.head.appendChild(style);
    },

    setupHTML: function () {
      if (document.getElementById("google_translate_element")) return;

      const container = document.createElement("div");
      container.id = "google_translate_element";
      container.style.display = "none";
      document.body.appendChild(container);

      const select = document.createElement("select");
      select.title = "Language";
      select.className = "langinput notranslate";
      select.setAttribute("onchange", "translateLanguage(this)");

      const languages = {
        en: "English",
        ms: "Malay",
        "zh-CN": "Chinese (Simplified)",
        "zh-TW": "Chinese (Traditional)",
        ta: "Tamil",
        hi: "Hindi",
        es: "Spanish",
        fr: "French",
        de: "German",
        ru: "Russian",
        ar: "Arabic",
        bn: "Bengali",
        pt: "Portuguese",
        ja: "Japanese",
        ko: "Korean",
        ur: "Urdu",
        te: "Telugu",
        ml: "Malayalam",
        kn: "Kannada"
      };


      for (const [code, label] of Object.entries(languages)) {
        const option = document.createElement("option");
        option.value = code;
        option.innerText = label;
        select.appendChild(option);
      }

      document.body.appendChild(select);
    },

    setupTranslateFunction: function () {
      if (window.translateLanguage) return;

window.translateLanguage = function (sel) {
  const langLabel = sel.options[sel.selectedIndex].text.toLowerCase();
  sel.disabled = true; // Optional: disable dropdown while waiting

  const tryTranslate = () => {
    const frame = document.querySelector("iframe.goog-te-menu-frame");
    if (!frame) {
      console.log("Waiting for Google Translate frame...");
      return false;
    }

    const frameDoc = frame.contentDocument || frame.contentWindow.document;
    const langItems = frameDoc.querySelectorAll(".goog-te-menu2-item span.text");

    for (let item of langItems) {
      if (item.innerText.toLowerCase() === langLabel) {
        item.click();
        sel.disabled = false;
        return true;
      }
    }

    return false;
  };

  // Retry every 300ms for up to 5 seconds
  let attempts = 0;
  const interval = setInterval(() => {
    if (tryTranslate() || attempts++ > 15) {
      clearInterval(interval);
      if (attempts > 15) {
        sel.disabled = false;
        alert("Translator failed to load. Please try again later.");
      }
    }
  }, 300);
}
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => plugin.init());
  } else {
    plugin.init();
  }
})();
