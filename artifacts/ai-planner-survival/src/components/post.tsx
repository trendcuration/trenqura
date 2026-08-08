import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getCategory, type Post } from "../data";
import { Tag } from "./layout";

export function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[hsl(var(--muted-foreground))]">
      <Tag>{post.kind}</Tag>
      {post.publishedAt && <span>{post.publishedAt}</span>}
      <span>읽는 데 {post.readingTime}</span>
    </div>
  );
}

export function PostCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`editorial-card group block overflow-hidden ${featured ? "md:p-0" : ""}`}
    >
      <>
        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className={`w-full object-cover ${featured ? "aspect-[16/8] md:aspect-[16/7]" : "aspect-[16/8]"}`}
            loading="lazy"
          />
        )}
      </>
      <div className={`p-5 ${featured ? "md:p-7" : ""}`}>
        <PostMeta post={post} />
        <h2
          className={`font-display mt-4 font-bold leading-[1.45] tracking-[-.03em] text-[hsl(var(--primary))] group-hover:text-[hsl(var(--accent))] ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}
        >
          {post.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[hsl(var(--muted-foreground))]">
          {post.excerpt}
        </p>
        <div className="mt-5 flex items-center justify-between text-xs">
          <span>{getCategory(post.category)?.name}</span>
          <ChevronRight className="text-[hsl(var(--accent))]" size={17} />
        </div>
      </div>
    </Link>
  );
}

const markdownH2 = (source: string) => {
  let fenced = false;
  return source.split(/\r?\n/).flatMap((line, index) => {
    if (/^\s*(`{3,}|~{3,})/.test(line)) {
      fenced = !fenced;
      return [];
    }
    if (fenced) return [];
    const match = line.match(/^ {0,3}##(?!#)\s+(.+?)\s*#*\s*$/);
    if (!match) return [];
    return [
      {
        id: `section-${index + 1}`,
        title: match[1]
          .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
          .replace(/[`*_~]/g, ""),
      },
    ];
  });
};

export function MarkdownToc({ markdown }: { markdown?: string }) {
  const headings = markdown ? markdownH2(markdown) : [];
  if (!headings.length) return null;
  return (
    <nav
      className="mt-8 border-y border-[hsl(var(--border))] py-5"
      aria-label="본문 목차"
    >
      <p className="rule-label">목차</p>
      <ol className="mt-3 space-y-2 text-sm leading-7">
        {headings.map(({ id, title }) => (
          <li key={id}>
            <a
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))]"
              href={`#${id}`}
            >
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PostBody({ post }: { post: Post }) {
  if (post.bodyMarkdown) {
    return (
      <div className="prose-editorial mt-12 markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ node, ...props }) => (
              <h2
                {...props}
                id={
                  node?.position?.start.line
                    ? `section-${node.position.start.line}`
                    : undefined
                }
                className="scroll-mt-24"
              />
            ),
          }}
        >
          {post.bodyMarkdown}
        </ReactMarkdown>
      </div>
    );
  }
  return (
    <div className="prose-editorial mt-12">
      {post.body.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </div>
  );
}

export function SummaryList({ summary }: { summary: string[] }) {
  if (!summary.length) return null;
  return (
    <div className="mt-10 border-y border-[hsl(var(--border))] py-6">
      <p className="rule-label">IN SHORT</p>
      <ul className="mt-4 space-y-2 text-sm leading-7">
        {summary.map((line) => (
          <li className="flex gap-3" key={line}>
            <Check size={16} className="mt-1 text-[hsl(var(--accent))]" />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
