export interface LinkButtonContent {
	label: string;
	destination: string | VoidFunction;
	mediaType: 'play' | 'read' | 'none';
	eventName: string;
	openInNewTab?: boolean;
  }