(function () {
  const translator = {
    init: function () {
      this.injectTranslateScript();
      this.setupCSS();
      this.setupDropdownListener();
      window.googleTranslateElementInit = this.initGoogleElement;
      window.translateLanguage = this.translateLanguage.bind(this);
      window.addEventListener('load', () => {
        this.translateLanguage();
      });
    },

    injectTranslateScript: function () {
      const script = document.createElement('script');
      script.defer = true;
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(script);
    },

    initGoogleElement: function () {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: true
      }, 'google_translate_element');
    },

    setupCSS: function () {
      const css = `
        body { top: 0px !important; }
        iframe.skiptranslate, .goog-te-banner-frame { display: none !important; }
        .input-field select.langinput { padding-top: .5em !important; }
      `;
      const style = document.createElement('style');
      style.innerHTML = css;
      document.head.appendChild(style);
    },

    getCookie: function (c_name) {
      const match = document.cookie.match(new RegExp('(^| )' + c_name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    },

    deleteAllCookies: function () {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=')[0].trim();
        document.cookie = cookie + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    },

    smartDeleteTranslateCookies: function () {
      const cookies = document.cookie.split('; ');
      for (let c = 0; c < cookies.length; c++) {
        let d = window.location.hostname.split('.');
        while (d.length > 0) {
          const cookieBase = encodeURIComponent(cookies[c].split(';')[0].split('=')[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
          let p = location.pathname.split('/');
          document.cookie = cookieBase + '/';
          while (p.length > 0) {
            document.cookie = cookieBase + p.join('/');
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
        document.cookie = 'googtrans=/en/' + lang;
        window.location.reload();
        return;
      }

      // Apply translation state
      const langcookie = this.getCookie('googtrans');
      if (langcookie) {
        document.querySelectorAll('.langinput option').forEach((option) => {
          if (langcookie === '/en/' + option.value) {
            option.selected = true;
          }
        });
      }

      const banner = document.querySelector('.goog-te-banner-frame');
      if (banner) banner.style.display = 'none';
      document.body.style.top = '0px';
    },

    setupDropdownListener: function () {
      const dropdown = document.querySelector('.langinput');
      if (dropdown) {
        dropdown.addEventListener('change', (e) => {
          this.translateLanguage(e.target);
        });
      }
    }
  };

  translator.init();
})();
