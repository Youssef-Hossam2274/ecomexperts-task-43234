import { ICONS, type IconName } from "./registry";
import type { IconProps } from "./types";

export interface IconComponentProps extends IconProps {
  /** Which icon to render. TypeScript autocompletes and enforces valid names. */
  name: IconName;
}

/**
 * Render any registered icon by name:
 *
 *   <Icon name="camera" size={30} />
 *   <Icon name="camera" color="currentColor" className="text-obsidian" />
 *
 * The name is looked up in the generated {@link ICONS} registry, so adding a new
 * SVG (then `npm run icons`) makes it instantly available here — no edits needed.
 */
export function Icon({ name, ...props }: IconComponentProps) {
  const Glyph = ICONS[name];
  return <Glyph {...props} />;
}
