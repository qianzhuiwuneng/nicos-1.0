/** Active state for primary nav links (matches Sidebar logic). */
export function isNavActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/monthly") return pathname === "/monthly";
  return pathname === href || pathname.startsWith(`${href}/`);
}
