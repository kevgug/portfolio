export interface LinkButtonContent {
  label: string;
  destination: string | VoidFunction;
  mediaType: "play" | "read" | "webpage" | "none" | "icon";
  eventName: string;
  openInNewTab?: boolean;
}
