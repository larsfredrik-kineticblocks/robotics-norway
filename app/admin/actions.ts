"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/form-state";
import {
  removeMember,
  requireAdminEmail,
  saveMember,
  setMemberStatus,
} from "@/lib/member-mutations";
import { logoFromFormFile, parseMemberEdit } from "@/lib/validation";

async function guard() {
  const admin = await requireAdminEmail();
  if (!admin) redirect("/admin/signin?error=AccessDenied");
  return admin;
}

export async function updateStatus(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!Number.isInteger(id) || (status !== "approved" && status !== "rejected")) {
    redirect("/admin?error=invalid");
  }
  try {
    await setMemberStatus(id, status);
  } catch (error) {
    console.error(error);
    redirect("/admin?error=database");
  }
  revalidatePath("/admin");
  revalidatePath("/members");
  redirect("/admin");
}

export async function deleteMember(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) redirect("/admin?error=invalid");
  try {
    await removeMember(id);
  } catch (error) {
    console.error(error);
    redirect("/admin?error=database");
  }
  revalidatePath("/admin");
  revalidatePath("/members");
  redirect("/admin");
}

export async function updateMember(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdminEmail();
  if (!admin) redirect("/admin/signin?error=AccessDenied");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) {
    return { status: "error", message: "Missing member.", fieldErrors: {} };
  }
  const logo = await logoFromFormFile(formData.get("logoFile"));
  if ("error" in logo && logo.error) {
    return { status: "error", message: null, fieldErrors: { logo: logo.error } };
  }
  const parsed = parseMemberEdit({
    companyName: String(formData.get("companyName") ?? ""),
    website: String(formData.get("website") ?? ""),
    logoUrl: String(formData.get("logoUrl") ?? ""),
    description: String(formData.get("description") ?? ""),
    contactPerson: String(formData.get("contactPerson") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    status: String(formData.get("status") ?? ""),
    logoDataUrl: logo.dataUrl,
  });
  if (!parsed.ok) {
    return { status: "error", message: "Check the fields below.", fieldErrors: parsed.fieldErrors };
  }
  const removeLogo = formData.get("removeLogo") === "on";
  const existingLogo = String(formData.get("existingLogo") ?? "");
  if (removeLogo) parsed.data.logoUrl = null;
  else if (!logo.dataUrl && !String(formData.get("logoUrl") ?? "").trim()) {
    parsed.data.logoUrl = existingLogo || null;
  }
  try {
    const saved = await saveMember(id, parsed.data);
    if (!saved.ok) return { status: "error", message: saved.message, fieldErrors: {} };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "The member could not be saved. Check DATABASE_URL.",
      fieldErrors: {},
    };
  }
  revalidatePath("/admin");
  revalidatePath("/members");
  redirect("/admin");
}
