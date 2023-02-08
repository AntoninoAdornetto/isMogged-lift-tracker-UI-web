export type Navigation = {
  page: string;
  href: string;
  styles: string;
  id: string;
  icon: string;
};

export const navLinks: Navigation[] = [
  {
    page: "Stats",
    href: "/stats",
    styles: "col-span-1",
    id: "stats--link",
    icon: "/images/stats--link--icon.png",
  },
  {
    page: "Logs",
    href: "/log",
    styles: "col-span-1",
    id: "log--link",
    icon: "/images/log--link--icon.png",
  },
  {
    page: "Mog Mode",
    href: "/dashboard",
    styles: "col-span-2",
    id: "mog--link",
    icon: "/images/mog--link--icon.png",
  },
  {
    page: "Exercises",
    href: "/exercise",
    styles: "col-span-1",
    id: "exercise--link",
    icon: "/images/exercise--link--icon.png",
  },
  {
    page: "Progress",
    href: "/progress",
    styles: "col-span-1",
    id: "progress--link",
    icon: "/images/progress--link--icon.png",
  },
];
