import { useNavigate } from 'react-router-dom';

export default function AddCardButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/card/register');
    };

    return (
        <div className="flex justify-center">
            <button 
                onClick={handleClick}
                className="px-8 py-2.5 bg-white text-[#111143] font-medium rounded-[28px] border border-[rgba(17,17,67,0.1)] hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
                style={{
                    boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.1), -1px -1px 2px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'Noto Sans KR, sans-serif'
                }}
            >
                카드 추가하기
            </button>
        </div>
    );
}

