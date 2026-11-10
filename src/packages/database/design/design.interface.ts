export interface IDesignWork {
  title: string;
  /** What kind of piece it is, shown under the title. */
  kind: string;
  /** Where the piece came from: the brief, contest or inspiration behind it. */
  description: string;
  image: string;
  /** Intrinsic size, so the strip can lay out before the image loads. */
  width: number;
  height: number;
}
