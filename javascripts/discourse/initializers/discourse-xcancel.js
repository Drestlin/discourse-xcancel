import { withPluginApi } from "discourse/lib/plugin-api";

function replaceLinksInElement(elem, targetDomain) {
  if (!elem) return;
  const links = elem.querySelectorAll("a[href*='x.com']");
  links.forEach(link => {
    // Sostituisce dominio nell'href
    link.href = link.href.replace(/(^https?:\/\/)x\.com/i, `$1${targetDomain}`);
    // Sostituisce testo visibile se contiene x.com
    if (link.textContent.match(/x\.com/i)) {
      link.textContent = link.textContent.replace(/x\.com/gi, targetDomain);
    }
  });
}

export default {
  name: "discourse-xcancel",

  initialize() {
    withPluginApi("0.8.7", api => {
      if (!settings.xcancel_enabled) {
        return;
      }

      const targetDomain = settings.xcancel_target;

      // Intercetta il rendering iniziale e i caricamenti dinamici
      api.decorateCookedElement(elem => replaceLinksInElement(elem, targetDomain), { id: "discourse-xcancel" });

      // Osserva cambiamenti nel DOM (quote, infinite scroll, edit live)
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // ELEMENT_NODE
              replaceLinksInElement(node, targetDomain);
            }
          });
        });
      });

      observer.observe(document.querySelector("#main-outlet"), {
        childList: true,
        subtree: true
      });
    });
  }
};
