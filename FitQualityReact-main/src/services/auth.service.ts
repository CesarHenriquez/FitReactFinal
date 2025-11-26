// --- Tipos ---
export type Role = "admin" | "cliente";

export interface User {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;   // email (solo @gmail.com)
  region: string;
  comuna: string;
  direccion: string;
  role: Role;
  password: string; // Agregado para la contraseña
}

const USERS_KEY = "users";
const SESSION_KEY = "fq_session";

// Utils de validación 
export function emailGmailValido(value: string) {
  const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return re.test(String(value).trim());
}

export function normalizarRun(run: string) {
  return String(run || "")
    .toUpperCase()
    .replace(/[.\s]/g, "")
    .replace(/-/g, "");
}

export function calcularDV(cuerpo: string) {
  let suma = 0, mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const resto = suma % 11;
  const dvCalc = 11 - resto;
  if (dvCalc === 11) return "0";
  if (dvCalc === 10) return "K";
  return String(dvCalc);
}

export function runValido(run: string) {
  const r = normalizarRun(run);
  if (!/^[0-9]{6,8}[0-9K]$/.test(r)) return false;
  const cuerpo = r.slice(0, -1);
  const dv = r.slice(-1);
  return calcularDV(cuerpo) === dv;
}

export function betweenLen(value: string, min: number, max: number) {
  const v = String(value || "");
  return v.length >= min && v.length <= max;
}

// Persistencia 
export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

export function saveUsers(list: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list ?? []));
}

export function upsertUser(u: User) {
  const list = getUsers();
  const idx = list.findIndex(x => x.correo === u.correo.toLowerCase());
  if (idx >= 0) list[idx] = u; else list.push(u);
  saveUsers(list);
}

export function findUserByEmail(email: string): User | null {
  return getUsers().find(x => x.correo === email.toLowerCase()) || null;
}

// Eliminar usuario 
export function deleteUserByEmail(email: string) {
  const target = email.toLowerCase();
  const list = getUsers().filter(u => u.correo.toLowerCase() !== target);
  saveUsers(list);

  // si borran al usuario con sesión activa, limpia sesión
  const s = getSession();
  if (s && s.email.toLowerCase() === target) {
    clearSession();
  }
}

//  Sesión 
export function setSession(email: string, role: Role) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, role, ts: Date.now() }));
}

export function getSession(): { email: string; role: Role } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Login 
export function login(email: string, password: string): Role {
  const u = findUserByEmail(email);
  const role: Role =
    password === "admin123" ? "admin" : (u?.role === "admin" ? "admin" : "cliente");

  setSession(email, role);
  return role;
}