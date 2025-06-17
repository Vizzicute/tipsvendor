export const routeAccess: Record<string, string[]> = {
  "/admin": ["admin"],
  "/admin/blog": ["admin", "blog_manager", "blog_staff"],
  "/admin/seo": ["admin", "seo_manager", "seo_staff"],
  "/admin/predictions": [
    "admin",
    "football_manager",
    "football_staff",
    "basketball_manager",
    "basketball_staff",
  ],
  "/dashboard": ["admin", "user"],
};
