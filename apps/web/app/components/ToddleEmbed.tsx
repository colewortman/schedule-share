"use client";

import React, { useEffect, PropsWithChildren } from "react";

const NORDCRAFT_SCRIPTS = {
  "toddle-main":
    "https://ra_tutorial_site.toddle.site/.toddle/custom-element/main.js",
  "toddle-link":
    "https://ra_tutorial_site.toddle.site/.toddle/custom-element/link.js",
} as const;

type NordcraftEmbedProps = {
  tag: keyof typeof NORDCRAFT_SCRIPTS;
  props?: Record<string, unknown>;
};

export default function NordcraftEmbed({
  tag,
  props,
  children,
}: PropsWithChildren<NordcraftEmbedProps>) {
  useEffect(() => {
    const src = NORDCRAFT_SCRIPTS[tag];

    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = src;
      document.body.appendChild(script);
    }
  }, [tag]);

  return React.createElement(tag, props, children);
}
