import apiClient from './axios';
import type { Card } from '../components/mycard/types/Card';
import basicCardImage from '../assets/card/basiccard.png';

// 내 카드 목록 API 응답 타입 (api/cards/my)
export interface MyCardsApiResponse {
  success: boolean;
  total: number;
  cards: Array<{
    id: number;
    name: string;
    benefit?: {
      category: string;
    };
    company?: string;
    last4_digit?: string;
  }>;
}

// BaseResponse로 래핑된 응답 타입 (카드 상세 조회용)
interface BaseResponse<T> {
  code: string;
  status: number;
  message: string;
  data: T;
}

// 카드 상세 조회 API 응답 타입 (백엔드 CardDetailResponse)
export interface CardDetailApiResponse {
  cardName: string;
  cardImageUrl: string;
  cardCompany: string;
  benefits: Array<{
    categoryName: string;
    benefitTitle: string;
    benefitComment: string;
    partnerNames: string[];
  }>;
}

/**
 * 내 카드 목록 조회 API
 * @returns 카드 목록
 */
export const getMyCards = async (): Promise<Card[]> => {
  try {
    const response = await apiClient.get<MyCardsApiResponse>('/api/cards/my');
    
    // 응답 데이터에서 cards 배열 추출
    const cardsData = response.data.cards || [];
    
    // 빈 배열인 경우 빈 배열 반환
    if (cardsData.length === 0) {
      return [];
    }
    
    // 백엔드 응답을 프론트엔드 Card 타입으로 변환
    const cards: Card[] = cardsData.map((card, index) => ({
      id: card.id, 
      name: card.name,
      company: card.company,
      last4_digit: card.last4_digit || '',
      isMainCard: index === 0, // 첫 번째 카드를 대표 카드로 설정 (백엔드에서 isMain 정보 제공 시 수정 필요)
      benefit: card.benefit?.category ? [{
        category: card.benefit.category,
        title: '',
        comment: '',
        parterName: [],
      }] : undefined,
      image: basicCardImage, // 기본 카드 이미지 사용
    }));
    
    return cards;
  } catch (error) {
    console.error('내 카드 조회 실패:', error);
    throw error;
  }
};

/**
 * 카드 상세 정보 조회 API
 * @param cardId - 조회할 카드의 ID
 * @returns 카드 상세 정보
 */
export const getCardDetail = async (cardId: number): Promise<Card> => {
  try {
    const response = await apiClient.get<BaseResponse<CardDetailApiResponse>>(
      `/api/cards/${cardId}`
    );

    // BaseResponse 구조에서 data 추출
    const cardData = response.data.data;

    // 백엔드 응답을 프론트엔드 Card 타입으로 변환
    const card: Card = {
      id: cardId,
      name: cardData.cardName,
      company: cardData.cardCompany,
      image: cardData.cardImageUrl || basicCardImage,
      benefit: cardData.benefits?.map(b => ({
        category: b.categoryName,
        title: b.benefitTitle,
        comment: b.benefitComment,
        parterName: b.partnerNames || [],
      })),
      // type과 isMainCard는 상세 API에서 제공하지 않으므로 기본값 사용
      type: undefined,
      isMainCard: false,  //main 카드 여부 필요..
      last4_digit: undefined,
    };

    return card;
  } catch (error) {
    console.error('카드 상세 조회 실패:', error);
    throw error;
  }
};

