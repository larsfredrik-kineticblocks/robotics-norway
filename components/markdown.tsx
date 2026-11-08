type MarkdownProps = {
  source: string;
};

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "hr" };

function parse(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let listKind: "ul" | "ol" = "ul";

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ type: "p", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(listKind === "ol" ? { type: "ol", items: list } : { type: "ul", items: list });
    list = [];
    listKind = "ul";
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }
    if (trimmed === "---") {
      flushParagraph();
      flushList();
      blocks.push({ type: "hr" });
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", text: trimmed.slice(4) });
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h1", text: trimmed.slice(2) });
      continue;
    }
    if (trimmed.startsWith("- ")) {
      if (list.length > 0 && listKind !== "ul") flushList();
      flushParagraph();
      listKind = "ul";
      list.push(trimmed.slice(2));
      continue;
    }
    const ordered = /^(\d+)\.\s+(.*)$/.exec(trimmed);
    if (ordered) {
      if (list.length > 0 && listKind !== "ol") flushList();
      flushParagraph();
      listKind = "ol";
      list.push(ordered[2]);
      continue;
    }
    flushList();
    paragraph.push(trimmed);
  }
  flushParagraph();
  flushList();
  return blocks;
}

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <span key={index}>{part}</span>;
  });
}

export function Markdown({ source }: MarkdownProps) {
  return (
    <div className="space-y-4 text-[15px] leading-7 text-ink">
      {parse(source).map((block, index) => {
        if (block.type === "h1") {
          return (
            <h2 key={index} className="font-heading text-3xl text-navy">
              {inline(block.text)}
            </h2>
          );
        }
        if (block.type === "h2") {
          return (
            <h3 key={index} className="pt-4 font-heading text-2xl text-navy">
              {inline(block.text)}
            </h3>
          );
        }
        if (block.type === "h3") {
          return (
            <h4 key={index} className="pt-2 font-heading text-xl text-navy">
              {inline(block.text)}
            </h4>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const ListTag = block.type === "ol" ? "ol" : "ul";
          return (
            <ListTag
              key={index}
              className={block.type === "ol" ? "list-decimal space-y-2 pl-5" : "list-disc space-y-2 pl-5"}
            >
              {block.items.map((item) => (
                <li key={item}>{inline(item)}</li>
              ))}
            </ListTag>
          );
        }
        if (block.type === "hr") return <hr key={index} className="border-border" />;
        return <p key={index}>{inline(block.text)}</p>;
      })}
    </div>
  );
}
