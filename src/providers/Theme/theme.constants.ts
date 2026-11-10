// Kept out of the "use client" provider module so the server layout can read the real string;
// importing a value from a client module into a server component yields a client reference instead.
export const THEME_STORAGE_KEY = "theme";
