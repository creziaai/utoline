// utoline runtime configuration.
// These values are read from environment variables at BUILD TIME (see scripts/build.js)
// and injected here as a plain global object. No secret keys belong in this file —
// GA Measurement IDs and AdSense Publisher/Slot IDs are public-facing by design.
window.utoline_CONFIG = {
  gaId: "",                 // e.g. "G-XXXXXXX"; leave empty to disable analytics
  adsenseEnabled: false, // true/false — false means no ad code loads at all
  adsensePublisherId: "", // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  siteUrl: "https://utoline.us.ci"
};
