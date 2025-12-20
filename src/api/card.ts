import apiClient from './axios';
import type { Card, CardDetail } from '../components/mycard/types/Card';
import basicCardImage from '../assets/card/basiccard.png';

// 내 카드 목록 API 응답 타입 (api/cards/my)
export interface MyCardApiResponse {
  cardId: number;
  cardName: string;
  company: string;
  lastFourDigits: string;
  partners: string[];
  main?: boolean;  // Java boolean isMain이 main 또는 isMain으로 직렬화될 수 있음
  isMain?: boolean;
  cardImageUrl?: string;  // null일 수 있음
}

// BaseResponse로 래핑된 응답 타입
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
  main: boolean;
}

/**
 * 내 카드 목록 조회 API
 * @returns 카드 목록
 */
export const getMyCards = async (): Promise<Card[]> => {
  try {
    const response = await apiClient.get<BaseResponse<MyCardApiResponse[]>>('/api/cards/my');
    
    // BaseResponse 구조에서 data 배열 추출
    const cardsData = response.data.data || [];
    
    // 디버깅: 실제 응답 데이터 확인
    console.log('API 응답 데이터:', cardsData);
    
    // 빈 배열인 경우 빈 배열 반환
    if (cardsData.length === 0) {
      return [];
    }
    
    // 백엔드 응답(MyCardApiResponse)을 프론트엔드 Card 타입으로 변환
    const cards: Card[] = cardsData.map((card, index) => {
      // 디버깅: 각 카드의 이미지 URL 확인
      console.log(`카드 ${index}:`, {
        cardName: card.cardName,
        cardImageUrl: card.cardImageUrl,
        isMain: card.isMain,
        main: card.main,
        rawCard: card
      });
      
      // main 또는 isMain 필드 처리 (Java boolean isMain이 main 또는 isMain으로 직렬화될 수 있음)
      const isMainCard = card.main ?? card.isMain ?? false;
      
      // cardImageUrl이 null, undefined, 빈 문자열인지 확인
      const imageUrl = card.cardImageUrl && card.cardImageUrl.trim() !== '' 
        ? card.cardImageUrl 
        : basicCardImage;
      
      return {
        id: card.cardId,
        userCardId: undefined, // UserCard ID는 별도로 조회 필요
        name: card.cardName,
        company: card.company,
        last4_digit: card.lastFourDigits || '',
        isMainCard: isMainCard,
        benefit: card.partners && card.partners.length > 0 ? [{
          category: '',
          title: '',
          comment: '',
          parterName: card.partners,
        }] : undefined,
        image: imageUrl,
      };
    });
    
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

// 카드 승인 내역 응답 타입
export interface CardTransactionResponse {
  transactionId: number;
  approvedAt: string;
  amount: string;
  storeName: string;
  storeType: string;
}

/**
 * 카드 승인 내역 조회 API
 * @param startDate - 조회 시작일 (yyyy-MM-dd)
 * @param endDate - 조회 종료일 (yyyy-MM-dd)
 * @returns 승인 내역 목록
 */
export const getCardTransactions = async (
  startDate: string,
  endDate: string
): Promise<CardTransactionResponse[]> => {
  try {
    // 백엔드는 BaseResponse로 래핑하지 않고 직접 배열을 반환
    const response = await apiClient.get<CardTransactionResponse[]>(
      '/api/cards/transactions',
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    // 응답이 배열인 경우 직접 반환
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // 예외 처리: 응답 형식이 예상과 다른 경우
    return [];
  } catch (error) {
    console.error('카드 승인 내역 조회 실패:', error);
    throw error;
  }
};

/**
 * 카드 상세 정보 조회 API
 * @param cardId - 조회할 카드의 ID
 * @returns 카드 상세 정보
 */
export const getCardDetail = async (cardId: number): Promise<CardDetail> => {
  try {
    const response = await apiClient.get<BaseResponse<CardDetailApiResponse>>(
      `/api/cards/${cardId}`
    );

    // BaseResponse 구조에서 data 추출
    const cardData = response.data.data;

    // 백엔드 응답을 프론트엔드 CardDetail 타입으로 변환
    const cardDetail: CardDetail = {
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
    };

    return cardDetail;
  } catch (error) {
    console.error('카드 상세 조회 실패:', error);
    throw error;
  }
};

