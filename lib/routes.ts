export const routeAccess: Record<string, string[]> = {
  "/admin": [
    "admin",
    "football_manager",
    "basketball_manager",
    "blog_manager",
    "seo_manager",
    "football_staff",
    "basketball_staff",
    "blog_staff",
  ],
  "/dashboard": ["admin", "user"],
};
