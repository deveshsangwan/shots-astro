export const siteConfig = {
  title: "Photography by Devesh Sangwan",
  subtitle: "See the world through my eyes!",
  author: "Devesh Sangwan",
  description: "A modern photography portfolio focused on storytelling through light, texture, and moments.",
  url: "https://deveshsangwan.github.io/shots-astro",
  footer: {
    name: "Hey there, I am Devesh Sangwan",
    bio: "A computer engineering student from New Delhi documenting moments through photography."
  },
  social: {
    github: "https://github.com/deveshsangwan",
    twitter: "https://twitter.com/sangwan2001",
    instagram: "https://www.instagram.com/devesh.sangwan/",
    linkedin: "https://www.linkedin.com/in/devesh-sangwan-4a6646165/"
  }
} as const;

export const navigation = [
  { href: "/", label: "Gallery" },
  { href: "/about", label: "About" }
] as const;
