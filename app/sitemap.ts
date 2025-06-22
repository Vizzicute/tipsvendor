import { getBlog, getBlogCategories } from "@/lib/appwrite/fetch";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const blogs = await getBlog();
    const blogCategories = await getBlogCategories();
    return [
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}`,
            priority: 1,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/register`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/banker`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/btts`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/chance`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/draw`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/either`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/htft`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/info`,
            priority: 0.4,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/livescore`,
            priority: 0.6,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/over1`,
            priority: 0.4,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/over2`,
            priority: 0.4,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/over3`,
            priority: 0.4,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/over4`,
            priority: 0.4,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/under4`,
            priority: 0.4,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/under3`,
            priority: 0.4,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/under2`,
            priority: 0.4,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/under1`,
            priority: 0.4,
            lastModified: Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/privacy`,
            priority: 0.4,
            lastModified: Date()
        },
        ...(blogs?.map((blog) => ({
            url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
            priority: 0.5,
            lastModified: Date()
        })) || []),
        ...(blogCategories?.map((category) => ({
            url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/category/${category.slug}`,
            priority: 0.5,
            lastModified: Date()
        })) || [])
    ]
}