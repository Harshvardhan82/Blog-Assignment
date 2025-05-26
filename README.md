# Next.js + Strapi v5 Blog

A modern blog application built with Next.js 15 (App Router) and Strapi v5, featuring static generation with runtime content updates.

## Features

- 🚀 **Next.js 15** with App Router
- 📝 **Strapi v5** headless CMS
- 🎨 **Dynamic Zones** for flexible content
- ⚡ **Static Generation** with ISR (Incremental Static Regeneration)
- 🔄 **Runtime Updates** without redeployment
- 📱 **Responsive Design** with Tailwind CSS
- 🎯 **TypeScript** for type safety
- 🔍 **SEO Optimized** with metadata generation

## Project Structure

```
├── app/
│   ├── page.tsx                 # Blog listing page
│   ├── blog/[slug]/page.tsx     # Dynamic blog post pages
│   ├── api/revalidate/route.ts  # On-demand revalidation
│   ├── loading.tsx              # Loading UI
│   └── not-found.tsx            # 404 page
├── components/
│   └── dynamic-zone-renderer.tsx # Strapi dynamic zone renderer
├── lib/
│   └── strapi.ts                # Strapi API integration
└── .env.local                   # Environment variables
```

## Quick Start

### 1. Clone and Setup Frontend

```bash
# Clone the repository
git clone <your-repo-url>
cd nextjs-strapi-blog

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 2. Setup Strapi Backend

```bash
# Create Strapi project in a separate directory
npx create-strapi-app@latest blog-backend --quickstart

# Navigate to Strapi directory
cd blog-backend

# Start Strapi
npm run develop
```

Strapi will open at `http://localhost:1337/admin`

### 3. Configure Strapi

#### Create Admin User
1. Open `http://localhost:1337/admin`
2. Create your admin account
3. Complete the setup wizard

#### Create Blog Post Content Type

1. Go to **Content-Type Builder** in the Strapi admin
2. Click **"Create new collection type"**
3. Name it `blog-post` (display name: "Blog Post")
4. Add the following fields:

**Text Fields:**
- `title` (Text, Required)
  - Advanced Settings → Set as entry title
- `author` (Text, Required)
- `excerpt` (Long text, Optional)

**UID Field:**
- `slug` (UID, Required)
  - Attached field: `title`

**Dynamic Zone:**
- `content` (Dynamic Zone, Optional)
  - Create components for the dynamic zone:

#### Create Dynamic Zone Components

1. **Rich Text Component** (`shared.rich-text`):
   - `body` (Rich text, Required)

2. **Quote Component** (`shared.quote`):
   - `text` (Long text, Required)
   - `author` (Text, Optional)

3. **Media Component** (`shared.media`):
   - `file` (Media, Required)
   - `caption` (Text, Optional)

4. **Slider Component** (`shared.slider`):
   - `files` (Media, Multiple files, Required)

#### Configure API Permissions

1. Go to **Settings → Users & Permissions Plugin → Roles**
2. Click on **Public**
3. Under **Blog-post**, check:
   - `find`
   - `findOne`
4. Click **Save**

#### Generate API Token (Optional)

1. Go to **Settings → API Tokens**
2. Click **"Create new API Token"**
3. Name: `Blog Frontend`
4. Token duration: `Unlimited`
5. Token type: `Read-only`
6. Copy the generated token

### 4. Configure Environment Variables

Update your `.env.local` file:

```env
# Strapi Configuration
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_api_token_here

# Optional: Secret for revalidation webhook
REVALIDATION_SECRET=your_secret_key_here
```

### 5. Start the Frontend

```bash
# Start Next.js development server
npm run dev
```

Visit `http://localhost:3000` to see your blog!

## Content Management

### Creating Blog Posts

1. Go to Strapi admin (`http://localhost:1337/admin`)
2. Navigate to **Content Manager → Blog Post**
3. Click **"Create new entry"**
4. Fill in the required fields:
   - **Title**: Your blog post title
   - **Slug**: Auto-generated from title
   - **Author**: Author name
   - **Excerpt**: Brief description (optional)
   - **Content**: Use the dynamic zone to add:
     - Rich text blocks
     - Quotes
     - Images/videos
     - Image sliders
5. Click **Save** and **Publish**

### Content Updates

The blog supports real-time content updates through:

1. **Automatic ISR**: Content revalidates every 60 seconds
2. **Manual Revalidation**: Call the revalidation API
3. **Webhook Integration**: Set up Strapi webhooks for instant updates

#### Setting Up Webhooks

1. In Strapi admin, go to **Settings → Webhooks**
2. Click **"Create new webhook"**
3. Configure:
   - **Name**: `Revalidate Blog`
   - **URL**: `http://localhost:3000/api/revalidate?secret=your_secret_key_here`
   - **Events**: Select `Entry Create`, `Entry Update`, `Entry Delete`
4. Save the webhook

## Development

### Mock Data Mode

When Strapi is not available, the app automatically uses mock data in development mode. You'll see a yellow banner indicating this state.

### Adding New Dynamic Zone Components

1. **Create the component in Strapi**:
   - Go to Content-Type Builder
   - Edit the `blog-post` content type
   - Add new component to the `content` dynamic zone

2. **Update the renderer**:
   - Edit `components/dynamic-zone-renderer.tsx`
   - Add a new case in the switch statement
   - Create the corresponding React component

Example:
```typescript
case "shared.video":
  return <VideoComponent key={component.id} url={component.url} />
```

### API Endpoints

- `GET /api/blog-posts` - List all blog posts
- `GET /api/blog-posts?filters[slug][$eq]=slug-name` - Get specific post
- `POST /api/revalidate?slug=post-slug` - Revalidate specific post
- `POST /api/revalidate` - Revalidate all posts

## Deployment

### Deploy Frontend to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Environment Variables for Production**:
   ```env
   STRAPI_URL=https://your-strapi-domain.com
   STRAPI_TOKEN=your_production_api_token
   REVALIDATION_SECRET=your_production_secret
   ```

### Deploy Strapi Backend

#### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option 2: Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-blog-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main
```

#### Option 3: DigitalOcean App Platform
1. Connect your Strapi repository
2. Configure build settings
3. Add database component
4. Deploy

### Update Webhook URLs

After deploying, update your Strapi webhook URLs to point to your production domain:
```
https://your-nextjs-domain.vercel.app/api/revalidate?secret=your_secret
```

## Troubleshooting

### Common Issues

1. **"Failed to fetch" error**:
   - Ensure Strapi is running on the correct port
   - Check STRAPI_URL in environment variables
   - Verify API permissions are set correctly

2. **Content not updating**:
   - Check webhook configuration
   - Verify REVALIDATION_SECRET matches
   - Test manual revalidation endpoint

3. **Dynamic zone not rendering**:
   - Ensure component names match exactly
   - Check component structure in Strapi
   - Verify populate parameter includes all relations

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will show detailed connection information and use mock data when Strapi is unavailable.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section
- Review Strapi v5 documentation
- Open an issue on GitHub
```
