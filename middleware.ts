import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: [
    '/',
    '/api/webhook',
    '/question/:id',
    '/tags',
    '/tags/:id',
    '/profile/:id',
    '/community',
    '/jobs'
  ],
  ignoredRoutes: [
    '/api/webhook', '/api/chatgpt',
    // The ad library and its export surface. Skipped by Clerk entirely rather
    // than merely made public: neither page reads auth state, and a headless
    // browser exporting a creative has no session, so Clerk's browser
    // interstitial would be served in place of the ad.
    '/ads', '/ads/render', '/ads/plan'
  ]
});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
 
