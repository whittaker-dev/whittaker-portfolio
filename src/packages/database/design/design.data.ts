import { IDesignWork } from "./design.interface";

/** Poster work from the Conian portfolio, before the move into full-time development. */
export const designArchiveUrl = "https://conianguys.vercel.app/poster";

const CURRY_TRIBUTE =
  "A tribute to Stephen Curry, one of the greatest basketball players of all time.";

export const designWorks: IDesignWork[] = [
  {
    title: "Iron Space",
    kind: "Movie poster",
    description: "My entry for a creative design contest organised by Feng.",
    image: "/assets/images/design/poster_cyberpunk.jpg",
    width: 989,
    height: 1400,
  },
  {
    title: "Virtual Space",
    kind: "Photo manipulation",
    description: "A personal piece inspired by astronauts and outer space.",
    image: "/assets/images/design/poster_space.jpg",
    width: 1120,
    height: 1400,
  },
  {
    title: "Peace Your Life",
    kind: "Photo manipulation",
    description: "From my space series, built around an astronaut helmet.",
    image: "/assets/images/design/poster_peace_your_life.jpg",
    width: 792,
    height: 990,
  },
  {
    title: "Jurassic World",
    kind: "Movie poster",
    description: "Inspired by the film of the same name.",
    image: "/assets/images/design/poster_jurassic_world.jpg",
    width: 938,
    height: 1400,
  },
  {
    title: "Spider-Man",
    kind: "Movie poster",
    description: "Fan art inspired by Spider-Man and the Avengers.",
    image: "/assets/images/design/poster_spider_man.jpg",
    width: 886,
    height: 886,
  },
  {
    title: "Curry No.1",
    kind: "Sports poster",
    description: CURRY_TRIBUTE,
    image: "/assets/images/design/poster_curry.jpg",
    width: 1400,
    height: 1400,
  },
  {
    title: "Curry No.3",
    kind: "Sneaker poster",
    description: CURRY_TRIBUTE,
    image: "/assets/images/design/poster_curry_shoes.jpg",
    width: 1400,
    height: 1400,
  },
  {
    title: "Curry No.4",
    kind: "Sneaker poster",
    description: CURRY_TRIBUTE,
    image: "/assets/images/design/poster_curry_no4.jpg",
    width: 886,
    height: 886,
  },
  {
    title: "Kobe Bryant",
    kind: "Sports poster",
    description: "A tribute to Kobe Bryant, the Lakers legend.",
    image: "/assets/images/design/poster_kobe_bryant.jpg",
    width: 886,
    height: 886,
  },
  {
    title: "Technology Face",
    kind: "Photo manipulation",
    description: "A personal piece inspired by technology.",
    image: "/assets/images/design/poster_techno.jpg",
    width: 1120,
    height: 1400,
  },
  {
    title: "Minh Tai",
    kind: "Collage",
    description: "A self-portrait collage.",
    image: "/assets/images/design/poster_self_collage.jpg",
    width: 792,
    height: 990,
  },
];
