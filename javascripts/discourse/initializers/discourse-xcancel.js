import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-xcancel",
  initialize() {
    withPluginApi("0.8.7", () => {
      function startObserver() {
        const target = document.querySelector("#main-outlet");
        if (!target) {
          // Se non esiste ancora, riprova al prossimo frame
          requestAnimationFrame(startObserver);
          return;
        }

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                node.querySelectorAll?.("a[href]").forEach((link) => {
                  const href = link.getAttribute("href");
                  if (/^https?:\/\/x\.com/i.test(href)) {
                    const nuovoHref = href.replace(
                      /^https?:\/\/x\.com/i,
                      "https://xcancel.com"
                    );
                    link.setAttribute("href", nuovoHref);
                  }
                });
              }
            });
          });
        });

        observer.observe(target, {
          childList: true,
          subtree: true
        });
      }

      startObserver();
    });
  },
};