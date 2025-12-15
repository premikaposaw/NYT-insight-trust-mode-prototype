# Design Guidelines: Fullstack JavaScript Demo Application

## Design Approach
**Reference-Based**: Drawing inspiration from modern developer platforms like Vercel, Railway, and Render - clean, technical aesthetics with strong visual hierarchy and clear feature demonstration.

## Typography System
- **Headings**: Inter (700 weight) - sizes: text-5xl (hero), text-3xl (sections), text-xl (cards)
- **Body**: Inter (400 weight) - text-base for content, text-sm for captions
- **Code/Technical**: Fira Code (monospace) - text-sm for API endpoints and technical details

## Layout & Spacing
**Tailwind Units**: Consistently use 4, 8, 12, 16, 20, 24, and 32 for spacing (p-4, gap-8, mb-12, py-20, etc.)

**Responsive Grid**: 
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 3 columns (lg:grid-cols-3) for feature cards

## Page Structure

### Hero Section (80vh)
- **Layout**: Split design - Left: Headline + description + CTA, Right: Large hero image
- **Content**: 
  - H1: "Build Fullstack Apps with Express & Node.js"
  - Subheading explaining the stack demonstration
  - Primary CTA button: "Try API Demo"
  - Secondary link: "View Documentation"
  - Badge showing "Live Server Status: Active"
- **Image**: Modern developer workspace or abstract tech visualization

### Live API Demo Section
- **Interactive Component**: 
  - Input field with "Send Test Request" button
  - Real-time response display area showing JSON formatted results
  - Visual indication of request/response flow
  - Sample endpoint buttons (GET /api/data, POST /api/submit)
- **Layout**: Single column, centered, max-w-3xl

### Features Grid (3 columns on desktop)
1. **Express Backend** - Icon + title + description of routing capabilities
2. **RESTful APIs** - Icon + title + explanation of endpoint structure
3. **Static Frontend** - Icon + title + modern HTML/CSS/JS integration
4. **Easy Deployment** - Icon + title + deployment readiness
5. **Middleware Support** - Icon + title + extensibility features
6. **Modern Stack** - Icon + title + tech stack benefits

### Tech Stack Section
- **Visual Showcase**: Cards displaying Node.js, Express, HTML5, CSS3, JavaScript logos
- **2-column layout** (md:grid-cols-2)
- Each card includes version info and brief capability description

### Code Example Section
- **Side-by-side layout**: Server code (left) + Frontend code (right)
- Syntax-highlighted code blocks (use Prism.js or similar)
- Tabbed interface to switch between different code examples
- "Copy Code" buttons for each snippet

### Footer
- **3-column grid**: 
  - Column 1: Quick Links (Home, Documentation, GitHub)
  - Column 2: Resources (API Reference, Tutorials, Support)
  - Column 3: Newsletter signup + social links (GitHub, Twitter)
- Copyright and "Built with Node.js + Express" text

## Component Library

### Buttons
- **Primary**: Solid background, rounded-lg, px-8 py-3, font-semibold
- **Secondary**: Outlined style, same padding
- **Icon Buttons**: Square (w-10 h-10), rounded-full for social icons

### Cards
- Rounded-xl borders
- Subtle shadow (shadow-sm hover:shadow-md transition)
- Padding: p-6 to p-8
- Gap between icon and content: gap-4

### Input Fields
- Rounded-lg borders
- Padding: px-4 py-3
- Full width in container
- Focus states with outline styling

### Status Badges
- Pill shape (rounded-full)
- Small size (text-xs px-3 py-1)
- Positioned inline with headers where relevant

## Images
1. **Hero Image**: Developer workspace with multiple monitors showing code, or abstract 3D tech visualization. Modern, professional aesthetic. Position: Right side of hero section, occupies 50% width on desktop.

2. **Feature Icons**: Use Heroicons library via CDN - select technical icons (ServerIcon, CodeBracketIcon, CloudIcon, CubeIcon, etc.)

## Accessibility
- Semantic HTML5 throughout (header, main, section, footer)
- ARIA labels for interactive elements
- Keyboard navigation support for all interactive components
- Sufficient contrast ratios for all text
- Focus indicators on all interactive elements

## Special Interactions
- Smooth scroll for anchor navigation
- Fade-in animations for cards on scroll (subtle, intersection observer)
- Live API response updates without page reload
- Syntax highlighting for code blocks
- Copy-to-clipboard functionality with visual feedback