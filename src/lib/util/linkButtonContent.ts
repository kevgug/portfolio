export interface LinkButtonContent {
	label: string;
	destination: string | VoidFunction;
	eventName: string;
	openInNewTab?: boolean;
  }