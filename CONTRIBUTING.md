# Contributing to TicketFlow

First off, thank you for considering contributing to TicketFlow! It's people like you that make TicketFlow such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and harassment-free experience for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and what you expected**
* **Include screenshots if possible**
* **Include your environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Provide specific examples to demonstrate the use case**
* **Explain why this enhancement would be useful**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following the code style guidelines below
4. **Test your changes**: Run `npm run build` and `npm run dev` to verify
5. **Commit your changes** with clear commit messages
6. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/ticketflow.git
cd ticketflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Groq credentials

# Run development server
npm run dev
```

## Code Style Guidelines

### TypeScript

- **No `any` types**: Use proper typing or `unknown` with type guards
- **Explicit return types** for functions (where reasonable)
- **Interfaces over types** for object shapes (except unions)
- **Descriptive variable names**: `ticketId` not `id`, `customerEmail` not `email`

```tsx
// ✅ Good
interface TicketFormData {
  subject: string;
  description: string;
}

async function createTicket(data: TicketFormData): Promise<Ticket> {
  // ...
}

// ❌ Bad
function createTicket(data: any) {
  // ...
}
```

### React / Next.js

- **Use "use client"** only when necessary (interactivity, hooks, context)
- **Server Components by default** for static content
- **Async Server Components** for data fetching
- **Descriptive component names**: `TicketDetailHeader` not `Header`
- **One component per file** (except small related components)

```tsx
// ✅ Good - Server Component
export default async function TicketsPage() {
  const tickets = await getTickets();
  return <TicketList tickets={tickets} />;
}

// ✅ Good - Client Component
"use client";
export default function SearchInput() {
  const [query, setQuery] = useState("");
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### Styling

- **Tailwind utility classes** for styling
- **Semantic class names**: Use descriptive groupings
- **Responsive design**: Mobile-first approach
- **Consistent spacing**: Use Tailwind spacing scale (4, 6, 8, 12, etc.)

```tsx
// ✅ Good
<div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200">

// ❌ Bad
<div className="flex items-center" style={{ gap: '16px', padding: '24px' }}>
```

### File Organization

```
components/
├── TicketCard.tsx          # ✅ PascalCase, descriptive
├── ticket-card.tsx         # ❌ kebab-case
├── Card.tsx                # ❌ Too generic

app/
├── (dashboard)/            # ✅ Route groups for layouts
│   ├── tickets/
│   │   ├── page.tsx        # ✅ Route component
│   │   └── [id]/
│   │       └── page.tsx    # ✅ Dynamic route
```

### Comments

- **Complex logic**: Explain the "why", not the "what"
- **Edge cases**: Document assumptions and constraints
- **TODOs**: Use `// TODO:` for future improvements
- **Section headers**: Use for major sections in large files

```tsx
// ✅ Good
// Debounce search to avoid hammering the API during typing
const debouncedSearch = useDebouncedValue(searchQuery, 300);

// ❌ Bad
// Set the search query
const debouncedSearch = useDebouncedValue(searchQuery, 300);
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add customer export to CSV
fix: resolve infinite loop in ticket subscription
docs: update installation instructions
style: format code with prettier
refactor: extract ticket status logic to utility
test: add tests for ticket creation
chore: update dependencies
```

## Testing Checklist

Before submitting a PR, ensure:

- [ ] Code builds without errors: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No ESLint errors: `npm run lint`
- [ ] Tested on desktop and mobile viewports
- [ ] Tested in Chrome, Firefox, and Safari (if UI changes)
- [ ] Animations are smooth and don't cause layout shift
- [ ] No console errors or warnings
- [ ] Environment variables documented in `.env.example` (if added)

## Feature Development Workflow

1. **Create an issue** describing the feature
2. **Wait for approval** from maintainers
3. **Create a branch**: `git checkout -b feat/your-feature-name`
4. **Implement the feature** with tests
5. **Update documentation** if needed (README, comments)
6. **Submit PR** with reference to the issue

## Architecture Decisions

When making significant architectural changes:

1. **Open a discussion** first (GitHub Discussions)
2. **Explain the problem** you're solving
3. **Propose alternatives** and trade-offs
4. **Wait for consensus** before implementing

## Questions?

Feel free to:
- Open a discussion in GitHub Discussions
- Comment on existing issues
- Reach out to maintainers

Thank you for contributing! 🎉
