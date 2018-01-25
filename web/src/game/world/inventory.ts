export class Inventory {
    public spriteIndexFromItemType = new Map<string, number>();
    
    constructor() {
        [
            ['flower', 0],
            ['bunny-fur', 1],
        ].forEach((t: any[]) => {
            this.spriteIndexFromItemType.set(t[0], t[1]);
        });
    }

    public spriteIndex(type: string) {
        return this.spriteIndexFromItemType.has(type) ? this.spriteIndexFromItemType.get(type) : 0;
    }
}