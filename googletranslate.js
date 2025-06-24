// AJ-TECHSOUL
(function () {
  const translator = {
    init: function () {
      this.injectTranslateScript();
      this.injectStyle();
      window.googleTranslateElementInit = this.initGoogleTranslateElement;
      window.translateLanguage = this.translateLanguage.bind(this);
      window.addEventListener("load", () => this.translateLanguage());
    },

    injectTranslateScript: function () {
      const script = document.createElement("script");
      script.defer = true;
      script.type = "text/javascript";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.head.appendChild(script);
    },

    initGoogleTranslateElement: function () {
      new google.translate.TranslateElement({
        pageLanguage: "en",
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: true
      }, "google_translate_element");
    },

    injectStyle: function () {
      const style = document.createElement("style");
      style.innerHTML = `
        body { top: 0px !important; }
        iframe.skiptranslate { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
        .input-field select.langinput { padding-top: .5em !important; }
      `;
      document.head.appendChild(style);
    },

    getCookie: function (name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    },

    deleteAllCookies: function () {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=")[0].trim();
        document.cookie = cookie + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    },

    smartDeleteTranslateCookies: function () {
      const cookies = document.cookie.split("; ");
      for (let c = 0; c < cookies.length; c++) {
        let d = window.location.hostname.split(".");
        while (d.length > 0) {
          const cookieBase =
            encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
            "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
            d.join(".") +
            " ;path=";
          let p = location.pathname.split("/");
          document.cookie = cookieBase + "/";
          while (p.length > 0) {
            document.cookie = cookieBase + p.join("/");
            p.pop();
          }
          d.shift();
        }
      }
    },

    translateLanguage: function (field) {
      if (field) {
        const lang = field.value;

        this.smartDeleteTranslateCookies();
        document.cookie = "googtrans=/en/" + lang;
        window.location.reload();
        return;
      }

      const langCookie = this.getCookie("googtrans");
      if (langCookie) {
        document.querySelectorAll(".langinput option").forEach((opt) => {
          if (langCookie === "/en/" + opt.value) {
            opt.selected = true;
          }
        });
      }

      const banner = document.querySelector(".goog-te-banner-frame");
      if (banner) banner.style.display = "none";
      document.body.style.top = "0px";
    }
  };

  translator.init();
})();
