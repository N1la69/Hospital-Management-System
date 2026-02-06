export interface DecodedToken {
  sub: string;
  roles: string[];
  exp: number;
}

export function decodeToken(token: string): DecodedToken {
  const payload = token.split(".")[1];
  const decoded = atob(payload);

  return JSON.parse(decoded);
}

export function getPrimaryRole(roles: string[]): string {
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("DOCTOR")) return "DOCTOR";
  if (roles.includes("PATIENT")) return "PATIENT";
  if (roles.includes("RECEPTIONIST")) return "RECEPTIONIST";
  if (roles.includes("PHARMACIST")) return "PHARMACIST";
  return "UNKNOWN";
}
