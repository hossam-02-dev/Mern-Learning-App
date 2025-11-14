import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const QuizQuestions = ({ 
  question, 
  questionIndex, 
  selectedAnswer, 
  onSelectAnswer, 
  showResults = false,
  isCorrect = false 
}) => {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
      {/* Numéro et texte de la question */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          {questionIndex + 1}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {question.questionText}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = showResults && option === question.correctAnswer;
              const isWrongSelection = showResults && isSelected && !isCorrect;

              return (
                <button
                  key={optionIndex}
                  onClick={() => !showResults && onSelectAnswer(questionIndex, option)}
                  disabled={showResults}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                    ${!showResults && !isSelected && "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"}
                    ${!showResults && isSelected && "border-indigo-600 bg-indigo-50"}
                    ${showResults && isCorrectOption && "border-green-500 bg-green-50"}
                    ${showResults && isWrongSelection && "border-red-500 bg-red-50"}
                    ${showResults && !isCorrectOption && !isWrongSelection && "border-gray-200 bg-gray-50 opacity-50"}
                    ${showResults ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Radio button */}
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${!showResults && !isSelected && "border-gray-300"}
                        ${!showResults && isSelected && "border-indigo-600 bg-indigo-600"}
                        ${showResults && isCorrectOption && "border-green-500 bg-green-500"}
                        ${showResults && isWrongSelection && "border-red-500 bg-red-500"}
                      `}>
                        {((!showResults && isSelected) || (showResults && isCorrectOption) || (showResults && isWrongSelection)) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>

                      {/* Texte de l'option */}
                      <span className={`
                        font-medium
                        ${!showResults && isSelected && "text-indigo-900"}
                        ${showResults && isCorrectOption && "text-green-900"}
                        ${showResults && isWrongSelection && "text-red-900"}
                        ${showResults && !isCorrectOption && !isWrongSelection && "text-gray-500"}
                      `}>
                        {option}
                      </span>
                    </div>

                    {/* Icônes de résultat */}
                    {showResults && isCorrectOption && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    {showResults && isWrongSelection && (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Message de résultat */}
          {showResults && (
            <div className={`
              mt-4 p-4 rounded-lg
              ${isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}
            `}>
              {isCorrect ? (
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Bonne réponse !</span>
                </p>
              ) : (
                <p className="flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">
                    Mauvaise réponse. La bonne réponse était : <strong>{question.correctAnswer}</strong>
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;