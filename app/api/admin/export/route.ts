import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admins";
import { databaseConfigured } from "@/lib/db";
import { membersToCsv, membersToXlsx } from "@/lib/export-members";
import { listAllMembers } from "@/lib/member-repository";

export async function GET(request: Request) {
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!email || !isAdminEmail(email)) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!databaseConfigured()) {
    return new Response("DATABASE_URL is not configured.", { status: 503 });
  }

  const { members } = await listAllMembers();
  const format = new URL(request.url).searchParams.get("format");
  if (format === "xlsx") {
    const body = membersToXlsx(members);
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="robotics-norway-members.xlsx"',
      },
    });
  }

  return new Response(membersToCsv(members), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="robotics-norway-members.csv"',
    },
  });
}
