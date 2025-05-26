import Link from "next/link"
import { getBlogPosts } from "@/lib/strapi"

export default async function HomePage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Blog</h1>
          <p className="text-lg text-gray-600">Powered by Next.js and Strapi</p>
        </header>

        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                      By {post.author} • {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                    <div className="text-gray-700 line-clamp-3">{post.excerpt && <p>{post.excerpt}</p>}</div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
