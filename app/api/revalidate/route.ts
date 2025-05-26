import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get("slug")
  const secret = searchParams.get("secret")

  if (process.env.REVALIDATION_SECRET && secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  try {
    if (slug) {
      revalidatePath(`/blog/${slug}`)
      revalidatePath("/")

      return NextResponse.json({
        revalidated: true,
        message: `Revalidated blog post: ${slug}`,
      })
    } else {
      revalidatePath("/")
      revalidateTag("blog-posts")

      return NextResponse.json({
        revalidated: true,
        message: "Revalidated all blog posts",
      })
    }
  } catch (error: any) {
    console.error("Error revalidating:", error)
    return NextResponse.json({ message: "Error revalidating", error: error.message }, { status: 500 })
  }
}
