export interface WrappedItem {
    readonly isDirty: boolean;
    reset(): void;
}