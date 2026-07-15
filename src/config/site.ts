export const siteConfig = {
  title: "Photography by Devesh Sangwan",
  shortTitle: "Devesh Sangwan",
  subtitle: "Landscapes, cities, quiet moments.",
  author: "Devesh Sangwan",
  description: "A photography portfolio of landscapes, cities, and quiet moments by Devesh Sangwan.",
  url: "https://shots.deveshsangwan.com",
  footer: {
    name: "Devesh Sangwan",
    bio: "A photographer from New Delhi documenting landscapes, cities, and quiet moments."
  },
  social: {
    github: "https://github.com/deveshsangwan",
    twitter: "https://twitter.com/sangwan2001",
    instagram: "https://www.instagram.com/sangwan.devesh/",
    linkedin: "https://www.linkedin.com/in/deveshsangwan/"
  }
} as const;

export const navigation = [
  { href: "/", label: "Gallery" },
  { href: "/about", label: "About" }
] as const;
