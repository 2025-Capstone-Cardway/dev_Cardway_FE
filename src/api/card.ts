import apiClient from './axios';
import type { Card } from '../components/mycard/types/Card';
import basicCardImage from '../assets/card/basiccard.png';

// API 응답 타입 정의 (백엔드 MyCardResponse)
export interface MyCardApiResponse {
  cardName: string;
  company: string;
  lastFourDigits: string;
  partners: string[];
}

// BaseResponse로 래핑된 응답 타입
interface BaseResponse<T> {
  code: string;
  status: number;
  message: string;
  data: T;
}

// API 명세 형태의 응답 (현재 사용하지 않음, 참고용)
// interface CardsApiResponse {
//   success: boolean;
//   total: number;
//   cards: Array<{
//     id: number;
//     name: string;
//     benefit?: {
//       category: string;
//     };
//     company?: string;
//     last4_digit?: string;
//   }>;
// }

/**
 * 내 카드 목록 조회 API
 * @returns 카드 목록
 */
export const getMyCards = async (): Promise<Card[]> => {
  try {
    const response = await apiClient.get<BaseResponse<MyCardApiResponse[]>>('/api/cards/my');
    
    // BaseResponse 구조에서 data 추출
    const cardsData = response.data.data || [];
    
    // 빈 배열인 경우 빈 배열 반환
    if (cardsData.length === 0) {
      return [];
    }
    
    // 백엔드 응답을 프론트엔드 Card 타입으로 변환
    const cards: Card[] = cardsData.map((card, index) => ({
      id: index + 1, // 백엔드에서 id를 제공하지 않으므로 임시로 인덱스 사용
      name: card.cardName,
      company: card.company,
      last4_digit: card.lastFourDigits || '', // 카드번호 끝 4자리 추가
      isMainCard: index === 0, // 첫 번째 카드를 대표 카드로 설정 (백엔드에서 isMain 정보 제공 시 수정 필요)
      benefit: card.partners && card.partners.length > 0 ? [{
        category: card.partners[0] || '', // 첫 번째 파트너를 카테고리로 사용
        title: '',
        comment: '',
        parterName: card.partners,
      }] : undefined,
      image: basicCardImage, // 기본 카드 이미지 사용
    }));
    
    return cards;
  } catch (error) {
    console.error('내 카드 조회 실패:', error);
    throw error;
  }
};

