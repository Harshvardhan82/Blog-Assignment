interface DynamicZoneComponent {
  __component: string
  id: number
  [key: string]: any
}

interface DynamicZoneRendererProps {
  content: DynamicZoneComponent[]
}

export function DynamicZoneRenderer({ content }: DynamicZoneRendererProps) {
  if (!content || !Array.isArray(content)) {
    return null
  }

  return (
    <div className="space-y-6">
      {content.map((component) => {
        switch (component.__component) {
          case "shared.rich-text":
            return <RichTextComponent key={component.id} content={component.body} />
          case "shared.quote":
            return <QuoteComponent key={component.id} text={component.text} author={component.author} />
          case "shared.media":
            return <MediaComponent key={component.id} file={component.file} caption={component.caption} />
          case "shared.slider":
            return <SliderComponent key={component.id} files={component.files} />
          default:
            console.warn(`Unknown component type: ${component.__component}`)
            return null
        }
      })}
    </div>
  )
}

function RichTextComponent({ content }: { content: string }) {
  return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
}

function QuoteComponent({ text, author }: { text: string; author?: string }) {
  return (
    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
      <p className="text-lg italic text-gray-800 mb-2">"{text}"</p>
      {author && <cite className="text-sm text-gray-600 font-medium">— {author}</cite>}
    </blockquote>
  )
}

function MediaComponent({ file, caption }: { file: any; caption?: string }) {
  if (!file) return null

  const isImage = file.mime?.startsWith("image/")
  const isVideo = file.mime?.startsWith("video/")

  return (
    <figure className="my-8">
      {isImage && (
        <img
          src={file.url || "/placeholder.svg"}
          alt={file.alternativeText || caption || ""}
          className="w-full h-auto rounded-lg shadow-md"
          width={file.width}
          height={file.height}
        />
      )}
      {isVideo && (
        <video
          src={file.url}
          controls
          className="w-full h-auto rounded-lg shadow-md"
          width={file.width}
          height={file.height}
        >
          Your browser does not support the video tag.
        </video>
      )}
      {caption && <figcaption className="text-sm text-gray-600 text-center mt-2">{caption}</figcaption>}
    </figure>
  )
}

function SliderComponent({ files }: { files: any[] }) {
  if (!files || files.length === 0) return null

  return (
    <div className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div key={file.id || index} className="relative">
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.alternativeText || `Slide ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
