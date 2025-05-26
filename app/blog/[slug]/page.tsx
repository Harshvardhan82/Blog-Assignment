import { notFound } from "next/navigation"
import Link from "next/link"
import { getBlogPost, getBlogPosts } from "@/lib/strapi"
import { DynamicZoneRenderer } from "@/components/dynamic-zone-renderer"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt || `Blog post by ${post.author}`,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Blog
            </Link>
          </nav>

          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                <div className="flex items-center text-gray-600 text-sm">
                  <span>By {post.author}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </header>

              <div className="prose prose-lg max-w-none">
                {post.content && <DynamicZoneRenderer content={post.content} />}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
