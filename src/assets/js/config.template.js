// utoline runtime configuration.
// These values are read from environment variables at BUILD TIME (see scripts/build.js)
// and injected here as a plain global object. No secret keys belong in this file —
// GA Measurement IDs and AdSense Publisher/Slot IDs are public-facing by design.
window.utoline_CONFIG = {
  gaId: "__GA_ID__",                 // e.g. "G-XXXXXXX"; leave empty to disable analytics
  adsenseEnabled: __ADSENSE_ENABLED__, // true/false — false means no ad code loads at all
  adsensePublisherId: "__ADSENSE_PUBLISHER_ID__", // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  siteUrl: "__SITE_URL__"
};
