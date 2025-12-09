
export interface Benefit{
    category: string,
    title: string,
    comment: string,
    parterName: string[];
}

export interface Card{
    id: number,
    userCardId?: number,  // UserCard ID (메인 카드 설정 시 필요)
    name: string,
    isMainCard: boolean;  //
    
    type?: string,
    benefit?: Benefit[],
    company?: string,
    last4_digit?: string;  // 카드번호 끝 4자리
    image?: string;
}
