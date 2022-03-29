export class GuardarNotificacion {
    constructor(
        public Target: number,
        public Title: string,
        public Content: string,
        public TargetIdentifiers: string[],
        public TestOnly: boolean,
        public UrlToRedirect: string,
        public ExtraProperties: Object,
    ) { }
}