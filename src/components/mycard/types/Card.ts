
export interface Benefit{
    category: string,
    title: string,
    comment: string,
    parterName: string[];
}

export interface Card{
    id: number,
    name: string,
    isMainCard: boolean;  //
    
    type?: string,
    benefit?: Benefit[],
    company?: string,
    image?: string;
}
