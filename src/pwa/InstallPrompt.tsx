// Bannière d'installation. Chrome ne montre plus la sienne tout seul.
// On affiche la nôtre dès l'arrivée sur le site.
// Sur Android, le bouton appelle la vraie installation dès que beforeinstallprompt arrive.
// Sur iPhone, cet événement n'existe pas : on explique le geste Partager.
// Masquée si l'app est déjà lancée depuis l'écran d'accueil, ou si la personne ferme la bannière.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "fouss-install-dismissed";

function dejaInstallee() {
  const standalone = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = "standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return standalone || iosStandalone;
}

function estIphone() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function InstallPrompt() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [invite, setInvite] = useState<BeforeInstallPromptEvent | null>(null);
  const [iphone, setIphone] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin") || dejaInstallee() || sessionStorage.getItem(DISMISS_KEY)) return;
    setIphone(estIphone());
    setVisible(true);

    const onInvite = (event: Event) => {
      event.preventDefault();
      setInvite(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setVisible(false);
    window.addEventListener("beforeinstallprompt", onInvite);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onInvite);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [pathname]);

  if (!visible) return null;

  async function installer() {
    if (!invite) return;
    await invite.prompt();
    const choix = await invite.userChoice;
    if (choix.outcome === "accepted") setVisible(false);
    setInvite(null);
  }

  function fermer() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-md rounded-2xl bg-[#2B211C] text-white shadow-xl p-4 flex gap-3 items-start">
      <img src="/logo-fouss.png" alt="" className="w-12 h-12 rounded-xl bg-white object-cover" />
      <div className="flex-1">
        <p className="font-semibold">Installer Fouss</p>
        <p className="text-sm text-[#E7DDD6] mt-1">
          {iphone
            ? "Sur iPhone : Partager, puis Sur l'écran d'accueil."
            : "Ajoute le salon à ton écran d'accueil, comme une application."}
        </p>
        {!iphone && (
          <button
            type="button"
            onClick={installer}
            disabled={!invite}
            className="mt-3 rounded-full bg-[#8C1913] px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {invite ? "Installer" : "Préparation..."}
          </button>
        )}
      </div>
      <button type="button" onClick={fermer} className="text-[#E7DDD6] text-sm" aria-label="Fermer">
        Fermer
      </button>
    </div>
  );
}
