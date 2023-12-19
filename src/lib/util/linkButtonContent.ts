export interface LinkButtonContent {
	label: string;
	destination: string | VoidFunction;
	mediaType: 'play' | 'read';
	eventName: string;
	openInNewTab?: boolean;
  }