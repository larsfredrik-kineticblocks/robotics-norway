import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { GoogleAuth } from "google-auth-library";
import { buildSearchCorpus } from "./build-search-index";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
};

type DocumentsFile = {
  sharedDrive: {
    id: string;
    name: string;
    url: string;
    membersOnly: boolean;
    note: string;
  };
  documents: Array<{
    slug: string;
    name: string;
    type: string;
    mimeType: string;
    id: string;
    link: string;
    lastModified: string;
    publicAnyoneWithLink: boolean;
    extract: string;
    translation: string | null;
  }>;
};

const EXPORTABLE = new Set([
  "application/vnd.google-apps.document",
  "application/vnd.google-apps.presentation",
]);

function loadCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  const folderId = process.env.DRIVE_FOLDER_ID?.trim();
  if (!raw || !folderId) return null;
  try {
    const credentials = raw.startsWith("{")
      ? (JSON.parse(raw) as Record<string, unknown>)
      : (JSON.parse(readFileSync(raw, "utf8")) as Record<string, unknown>);
    return { credentials, folderId };
  } catch {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_JSON could not be parsed. Provide the service account JSON string or a path to the JSON file.",
    );
  }
}

function slugify(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function typeLabel(mimeType: string) {
  if (mimeType === "application/vnd.google-apps.document") return "Google Doc";
  if (mimeType === "application/vnd.google-apps.presentation") return "Google Slides";
  if (mimeType === "application/vnd.google-apps.spreadsheet") return "Google Sheet";
  if (mimeType === "application/pdf") return "PDF";
  return mimeType;
}

async function listFiles(
  request: (url: string) => Promise<{ files?: DriveFile[] }>,
  folderId: string,
) {
  const query = encodeURIComponent(`'${folderId.replaceAll("'", "\\'")}' in parents and trashed = false`);
  const shared = `https://www.googleapis.com/drive/v3/files?q=${query}&supportsAllDrives=true&includeItemsFromAllDrives=true&corpora=drive&driveId=${encodeURIComponent(folderId)}&fields=files(id,name,mimeType,modifiedTime,webViewLink)&pageSize=100`;
  try {
    const data = await request(shared);
    if (data.files) return data.files;
  } catch (error) {
    console.error("Shared-drive listing failed, retrying across all drives.", error);
  }
  const fallback = `https://www.googleapis.com/drive/v3/files?q=${query}&supportsAllDrives=true&includeItemsFromAllDrives=true&corpora=allDrives&fields=files(id,name,mimeType,modifiedTime,webViewLink)&pageSize=100`;
  const data = await request(fallback);
  return data.files ?? [];
}

async function main() {
  const loaded = loadCredentials();
  if (!loaded) {
    console.log(
      "GOOGLE_SERVICE_ACCOUNT_JSON or DRIVE_FOLDER_ID is not set. Leaving the bundled document index in place.",
    );
    return;
  }

  const auth = new GoogleAuth({
    credentials: loaded.credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  const client = await auth.getClient();
  const request = async <T>(url: string) => {
    const response = await client.request<T>({ url });
    return response.data;
  };

  const files = await listFiles(request, loaded.folderId);
  const documentsPath = path.join(process.cwd(), "data/documents.json");
  const documentsFile = JSON.parse(readFileSync(documentsPath, "utf8")) as DocumentsFile;
  const byId = new Map(documentsFile.documents.map((document) => [document.id, document]));
  const extractDir = path.join(process.cwd(), "content/legal/extracted");
  mkdirSync(extractDir, { recursive: true });

  for (const file of files) {
    let entry = byId.get(file.id);
    if (!entry) {
      const base = slugify(file.name) || file.id;
      let slug = base;
      let n = 2;
      while (documentsFile.documents.some((document) => document.slug === slug)) {
        slug = `${base}-${n++}`;
      }
      entry = {
        slug,
        name: file.name,
        type: typeLabel(file.mimeType),
        mimeType: file.mimeType,
        id: file.id,
        link: file.webViewLink ?? `https://drive.google.com/file/d/${file.id}/view`,
        lastModified: file.modifiedTime ?? new Date().toISOString(),
        publicAnyoneWithLink: true,
        extract: "invitation",
        translation: null,
      };
      documentsFile.documents.push(entry);
      byId.set(file.id, entry);
    }

    entry.name = file.name;
    entry.mimeType = file.mimeType;
    entry.type = typeLabel(file.mimeType);
    if (file.modifiedTime) entry.lastModified = file.modifiedTime;
    if (file.webViewLink) entry.link = file.webViewLink;

    if (EXPORTABLE.has(file.mimeType)) {
      const url = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain&supportsAllDrives=true`;
      const exported = await client.request<string>({ url, responseType: "text" });
      const text = String(exported.data ?? "").trim();
      if (text.length > 40) {
        writeFileSync(path.join(extractDir, `${entry.slug}.txt`), `${text}\n`);
        console.log(`Exported text for ${entry.name}`);
      }
    }
  }

  writeFileSync(documentsPath, `${JSON.stringify(documentsFile, null, 2)}\n`);
  const corpus = buildSearchCorpus();
  writeFileSync(
    path.join(process.cwd(), "data/search-corpus.json"),
    `${JSON.stringify(corpus, null, 2)}\n`,
  );
  console.log(`Updated ${files.length} Drive file(s) and regenerated the search corpus.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
