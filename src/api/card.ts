import apiClient from './axios';
import type { Card } from '../components/mycard/types/Card';
import basicCardImage from '../assets/card/basiccard.png';

// 내 카드 목록 API 응답 타입 (api/cards/my)
export interface MyCardsApiResponse {
  success: boolean;
  total: number;
  cards: Array<{
    id: number;
    userCardId?: number;  // UserCard ID
    name: string;
    benefit?: {
      category: string;
    };
    company?: string;
    last4_digit?: string;
    isMain?: boolean;
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
      userCardId: card.userCardId, // UserCard ID (메인 카드 설정 시 필요)
      name: card.name,
      company: card.company,
      last4_digit: card.last4_digit || '',
      isMainCard: card.isMain !== undefined ? card.isMain : (index === 0), // 백엔드에서 isMain 제공 시 사용, 없으면 첫 번째 카드를 메인으로
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

// 메인 카드 설정 API 응답 타입
export interface SetMainCardApiResponse {
  status: string;
  userId: number;
  cardId: number;
  isMain: boolean;
  updatedAt: string;
}

/**
 * 메인 카드 설정 API
 * @param userCardId - UserCard의 ID
 * @param isMain - 메인 카드 설정 여부 (true: 메인으로 등록, false: 메인 취소)
 * @returns 설정 결과
 */
export const setMainCard = async (userCardId: number, isMain: boolean = true): Promise<SetMainCardApiResponse> => {
  try {
    const response = await apiClient.patch<SetMainCardApiResponse>(
      `/api/cards/main/${userCardId}`,
      { isMain }
    );
    
    return response.data;
  } catch (error) {
    console.error('메인 카드 설정 실패:', error);
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

