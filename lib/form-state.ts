export type ActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Record<string, string>;
};

export const idleState: ActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
