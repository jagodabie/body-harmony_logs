import './index.css';

type MacrosProps = {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    className?: string;
}

export const Macros = ({
    calories,
    protein,
    carbohydrates,
    fat,
    className='',
}: MacrosProps) => {
    return (
        <div className={`macros ${className}`}>
            <div className="macros__calories">{calories} kcal</div>
            <div className="macros__protein">Protein: {protein} g</div>
            <div className="macros__carbohydrates">Carbs: {carbohydrates} g</div>
            <div className="macros__fat">Fat: {fat} g</div>
        </div>
    );
};