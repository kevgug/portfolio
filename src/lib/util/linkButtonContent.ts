export interface LinkButtonContent {
	label: string;
	destination: string | VoidFunction;
	mediaType: 'play' | 'read' | 'webpage' | 'none';
	eventName: string;
	openInNewTab?: boolean;
  }