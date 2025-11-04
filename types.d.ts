declare global {
  type PageProps<T extends string = never> = import("./types").PageProps<T>
  type LayoutProps<T extends string = never> = import("./types").LayoutProps<T>
}

export {}
