export interface IDirectoryNodes {
    id: number;
    label: string;
    icon?: string;
    hasCaret?: boolean;
    isExpanded?: boolean;
    isDirectory: boolean;
    childNodes: IDirectoryNodes[];
}
