import type{Card, Benefit } from './types/Card';
import CardView from './Card';
import basicCardImage from '../../assets/card/basiccard.png'

const mockBenefits: Benefit[] = [
    { category: "문화", title: "모든가맹점", comment: "구체적인 혜택", parterName: []},
    { category: "영화관", title: "모든가맹점", comment: "월 1회 제공", parterName: []}
];

const mockCards: Card[] = [
    {
        id: 1,
        name: "국민 노리 카드",
        type: "체크카드",
        company: "KB국민",
        image: basicCardImage, 
        benefit: mockBenefits, 
        isMainCard: true
    },
    {
        id: 2,
        name: "신한 마이 베네핏",
        type: "신용카드",
        company: "신한카드",
        image: basicCardImage,
        benefit: [
            {
                category: "서점",
                title: "모든가맹점 할인",
                comment: "일 1회, 월 4회",
                parterName: ["교보문고"]
            }
        ],
        isMainCard: false
    }
]


export default function CardList(){
    return(
        <div className="w-full px-4 max-w-[480px] mx-auto space-y-4">
            {mockCards.map((card) => (
                <CardView key={card.id} card={card} />
            ))}
        </div>
    );
}