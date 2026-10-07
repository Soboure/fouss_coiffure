// Enregistre le service worker. Importé une seule fois depuis src/main.tsx.
// Sans cet appel, public/sw.js existe mais le navigateur ne l'installe pas.

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("Service worker non enregistré", error);
    });
  });
}
