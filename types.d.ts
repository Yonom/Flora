declare module "json-autocomplete" {
  export default function jsonAutocomplete(partial: string): string;
}

declare module "jsonrepair/lib/cjs" {
  export function jsonrepair(partial: string): string;
}

declare module "react-native/Libraries/Core/Devtools/getDevServer" {
  export default function getDevServer(): {
    url?: string;
  };
}
