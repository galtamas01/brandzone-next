/** A csapattagok. Új tag: kép a public/img/team/ alá (640×768 webp), majd egy új sor ide. */
export type TeamMember = { name: string; role: string; photo: string; linkedin?: string };

export const TEAM: TeamMember[] = [
  {
    name: "Lőrincz Bence",
    role: "Co-owner & Founder",
    photo: "/img/team/bence.webp",
    linkedin: "https://www.linkedin.com/in/bence-l%C5%91rincz-bb4953380",
  },
  {
    name: "Mag Dániel",
    role: "Co-owner & Creative Director",
    photo: "/img/team/daniel.webp",
    linkedin: "https://www.linkedin.com/in/mag-daniel-8ab64b349",
  },
  {
    name: "Gál Krisztián",
    role: "Co-owner & CEO",
    photo: "/img/team/krisztian.webp",
    linkedin: "https://www.linkedin.com/in/krisztian-gal-99368a359",
  },
  {
    name: "Vieriu Cristian",
    role: "Account Manager",
    photo: "/img/team/cristian.webp",
    linkedin: "https://www.linkedin.com/in/cristian-vieriu-bb6284353",
  },
  { name: "Veres Kinga", role: "Creative Scriptwriter", photo: "/img/team/kinga.webp" },
  { name: "Kiss Szabolcs", role: "Video Editor", photo: "/img/team/szabolcs.webp" },
  { name: "Péter Levente", role: "Videographer", photo: "/img/team/levente.webp" },
];

export const TEAM_PHOTO = { src: "/img/team/team.webp", width: 1400, height: 878 };
