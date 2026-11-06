"use server";

import type { ActionState } from "@/lib/form-state";
import { insertApplication } from "@/lib/member-mutations";
import { logoFromFormFile, parseApplication } from "@/lib/validation";

export async function submitApplication(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const logo = await logoFromFormFile(formData.get("logoFile"));
  if ("error" in logo && logo.error) {
    return { status: "error", message: null, fieldErrors: { logo: logo.error } };
  }
  const parsed = parseApplication({
    companyName: String(formData.get("companyName") ?? ""),
    website: String(formData.get("website") ?? ""),
    logoUrl: String(formData.get("logoUrl") ?? ""),
    description: String(formData.get("description") ?? ""),
    contactPerson: String(formData.get("contactPerson") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    consent: formData.get("consent") === "on",
    logoDataUrl: logo.dataUrl,
  });
  if (!parsed.ok) {
    return { status: "error", message: "Check the fields below.", fieldErrors: parsed.fieldErrors };
  }
  try {
    return await insertApplication(parsed.data);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "The application could not be stored. Try again later.",
      fieldErrors: {},
    };
  }
}
