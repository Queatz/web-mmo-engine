export class InvItem {
    type: string;
    qty: number;

    constructor(type: string, qty: number) {
        this.type = type;
        this.qty = qty;
    }
}

export class Inventory {
    private spriteIndexFromItemType = new Map<string, number>();
    private items: Map<string, InvItem> = new Map<string, InvItem>();
    public onInventoryUpdatedObservable: BABYLON.Observable<InvItem> = new BABYLON.Observable<InvItem>();
    
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

    public set(inv: InvItem) {
        this.items.set(inv.type, inv);
        this.onInventoryUpdatedObservable.notifyObservers(inv);
    }

    public all() {
        return this.items;
    }
}