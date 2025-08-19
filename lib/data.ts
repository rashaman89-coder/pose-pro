import type { Pose, ShotItem } from "./types";

export const poses: Pose[] = [
  { id: "w1", title: "First look by window", category: "wedding", imageUrl: "/images/wedding/w1.jpg", instructions: "Par stoji pored velikog prozora; ona gleda u njega, on zatvara oči pa otvara—uhvati emociju u trenutku.", tags: ["indoor","soft light","50mm","emotional"] },
  { id: "c7", title: "Walking & laughing", category: "couple", imageUrl: "/images/couple/c7.jpg", instructions: "Neka hodaju prema tebi i zezaju se; traži da se naslone ramenima.", tags: ["outdoor","golden hour","85mm"] },
  { id: "p3", title: "Portrait hands framing face", category: "portrait", imageUrl: "/images/portrait/p3.jpg", instructions: "Ruke blago u kadru prave okvir oko lica, brada malo napred.", tags: ["studio","softbox","35mm"] }
];

export const weddingMustHave: ShotItem[] = [
  { id: "s1", label: "Details: rings, dress, shoes", required: true },
  { id: "s2", label: "Bridal prep & makeup", required: true },
  { id: "s3", label: "Groom prep & accessories", required: true },
  { id: "s4", label: "First look", required: true },
  { id: "s5", label: "Ceremony wide & vows", required: true },
  { id: "s6", label: "Ring exchange & kiss", required: true },
  { id: "s7", label: "Family formals (list)", required: true },
  { id: "s8", label: "Couple portraits (sunset)", required: true },
  { id: "s9", label: "Reception details & first dance", required: true }
];
