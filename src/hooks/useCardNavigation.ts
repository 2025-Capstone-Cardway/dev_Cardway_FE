import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useCardNavigation() {
  const navigate = useNavigate();

  return useCallback(
    (cardId: number) => {
      navigate(`/card/${cardId}`);
    },
    [navigate]
  );
}

