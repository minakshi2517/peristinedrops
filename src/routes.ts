import type { MouseEvent as ReactMouseEvent } from "react";

export type Page = "home" | "about" | "products" | "brand" | "gallery" | "contact";
export type Go = (event: ReactMouseEvent | null, to: Page, hash?: string) => void;

export const PAGES: Record<Page, { path: string; label: string; title: string }> = {
  home: { path: "/", label: "Home", title: "Pristine Drops — Goodness in every drop" },
  about: { path: "/about", label: "About", title: "About — Pristine Drops" },
  products: { path: "/products", label: "Products", title: "Products — Pristine Drops" },
  brand: { path: "/brand", label: "Brand", title: "Brand identity — Pristine Drops" },
  gallery: { path: "/gallery", label: "Gallery", title: "Gallery — Pristine Drops" },
  contact: { path: "/contact", label: "Contact", title: "Contact — Pristine Drops" },
};

export const NAV: Page[] = ["about", "products", "brand", "gallery", "contact"];
export const ALL: Page[] = ["home", ...NAV];

export function pageFrom(pathname: string): Page {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return ALL.find((key) => PAGES[key].path === clean) ?? "home";
}
