import type { MouseEvent as ReactMouseEvent } from "react";

export type Page = "home" | "about" | "products" | "story" | "gallery" | "contact";
export type Go = (event: ReactMouseEvent | null, to: Page, hash?: string) => void;

export const PAGES: Record<Page, { path: string; label: string; title: string }> = {
  home: { path: "/", label: "Home", title: "Pristine Drops — Goodness in every drop" },
  about: { path: "/about", label: "About", title: "About — Pristine Drops" },
  products: { path: "/products", label: "Products", title: "Products — Pristine Drops" },
  story: { path: "/story", label: "Founder Story", title: "Founder Story — Pristine Drops" },
  gallery: { path: "/gallery", label: "Gallery", title: "Gallery — Pristine Drops" },
  contact: { path: "/contact", label: "Contact", title: "Contact — Pristine Drops" },
};

export const NAV: Page[] = ["about", "products", "story", "gallery", "contact"];
export const ALL: Page[] = ["home", ...NAV];

export function pageFrom(pathname: string): Page {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/brand" || clean === "/founder-story") return "story";
  return ALL.find((key) => PAGES[key].path === clean) ?? "home";
}
