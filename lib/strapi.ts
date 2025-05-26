const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_TOKEN

interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface BlogPost {
  id: number
  documentId: string
  title: string
  slug: string
  author: string
  content?: any[]
  excerpt?: string
  publishedAt: string
  createdAt: string
  updatedAt: string
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`
  }

  console.log(headers);


  const response = await fetch(url, {
    ...options,
    headers,
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch from Strapi: ${response.statusText}`)
  }

  return response.json()
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetchAPI<StrapiResponse<BlogPost[]>>("/blog-posts?populate=*&sort=publishedAt:desc")
    return response.data || []
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetchAPI<StrapiResponse<BlogPost[]>>(`/blog-posts?filters[slug][$eq]=${slug}&populate=deep`)

    const posts = response.data
    return posts && posts.length > 0 ? posts[0] : null
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function revalidateBlogPost(slug: string) {
  try {
    const response = await fetch(`/api/revalidate?slug=${slug}`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Failed to revalidate")
    }

    return await response.json()
  } catch (error) {
    console.error("Error revalidating blog post:", error)
    throw error
  }
}
