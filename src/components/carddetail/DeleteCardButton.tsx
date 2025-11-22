interface DeleteCardButtonProps {
    onDelete: () => void;
}

export default function DeleteCardButton({ onDelete }: DeleteCardButtonProps) {
    return (
        <button 
            onClick={onDelete}
            className="px-6 py-2 bg-white text-[#111143] text-sm font-medium rounded-[28px] border border-[rgba(17,17,67,0.1)] hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
            style={{
                boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.1), -1px -1px 2px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Noto Sans KR, sans-serif'
            }}
        >
            카드 삭제하기
        </button>
    );
}

