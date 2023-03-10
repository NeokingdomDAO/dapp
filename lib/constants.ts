const COMMON_FIELDS = ["display_name", "email", "ethereum_address"];

export const USER_FIELDS = {
  neokingdom: [...COMMON_FIELDS, "avatar_256"],
  teledisko: [...COMMON_FIELDS, "image"],
};

export const STAGE_TO_ID_MAP: Record<string, number> = {
  backlog: 29,
  created: 29,
  progress: 30,
  inprogress: 30,
  done: 31, // 161 !!
  approved: 32,
  canceled: 162,
};

export const STAGE_NAMES_MAP: Record<string, string> = {
  backlog: "Backlog",
  created: "Created",
  progress: "In Progress",
  inprogress: "In Progress",
  done: "Done",
  approved: "Approved",
  canceled: "Canceled",
};

export const STAGE_TO_COLOR_MAP: Record<string, string> = {
  created: "default",
  inprogress: "primary",
  done: "success",
  approved: "warning",
};
