import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Getquiz, SubmitQuiz } from "../../apis/Quizes";
import QuizQuestions from "../../components/QuizQuestions";
import {
  Clock,
  Award,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Send,
  AlertCircle,
  Trophy,
} from "lucide-react";

const TakeQuiz = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining, showResults]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await Getquiz(quizId);
      if (res.data.success) {
        setQuiz(res.data.data);
        setTimeRemaining(res.data.data.duration * 60);
      }
    } catch (err) {
      console.error("Erreur récupération du quiz :", err);
      setError(err?.response?.data?.message || "Impossible de charger le quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleSelectAnswer = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleAutoSubmit = () => {
    alert("⏰ Le temps est écoulé ! Votre quiz va être soumis automatiquement.");
    handleSubmit();
  };

  const handleSubmit = async () => {
    const unansweredCount = quiz.questions.length - Object.keys(answers).length;
    if (unansweredCount > 0 && timeRemaining > 0) {
      const confirm = window.confirm(
        `Il vous reste ${unansweredCount} question(s) sans réponse. Voulez-vous vraiment soumettre ?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formattedAnswers = quiz.questions.map((question, index) => ({
        questionIndex: index,
        answer: answers[index] || "",
      }));

      const res = await SubmitQuiz(quizId, formattedAnswers);

      if (res.data.success) {
        setResults(res.data.data);
        setShowResults(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Erreur soumission quiz :", err);
      setError(err?.response?.data?.message || "Erreur lors de la soumission du quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-red-900">Erreur</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
              <p className="text-indigo-100">Prêt à tester vos connaissances ?</p>
            </div>

            <div className="p-8">
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Durée du quiz</p>
                    <p className="text-xl font-bold text-gray-900">
                      {quiz.duration} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                  <Award className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Points maximum</p>
                    <p className="text-xl font-bold text-gray-900">{quiz.points}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Nombre de questions</p>
                    <p className="text-xl font-bold text-gray-900">
                      {quiz.questions.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8 rounded">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-2">
                      Instructions importantes :
                    </h4>
                    <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                      <li>Vous avez {quiz.duration} minutes pour compléter ce quiz</li>
                      <li>Le quiz sera automatiquement soumis à la fin du temps</li>
                      <li>Assurez-vous d'avoir une connexion internet stable</li>
                      <li>Vous pouvez repasser le quiz si nécessaire</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartQuiz}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Commencer le quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    const percentage = Math.round((results.score / quiz.points) * 100);
    const isPassed = percentage >= 50;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div
              className={`p-8 text-white ${
                isPassed
                  ? "bg-gradient-to-r from-green-600 to-emerald-600"
                  : "bg-gradient-to-r from-orange-600 to-red-600"
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                {isPassed ? (
                  <Trophy className="w-20 h-20" />
                ) : (
                  <XCircle className="w-20 h-20" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-center mb-2">
                {isPassed ? "Félicitations ! 🎉" : "Quiz terminé"}
              </h1>
              <p className="text-center text-lg opacity-90">
                {isPassed
                  ? "Vous avez réussi le quiz !"
                  : "Continuez vos efforts, vous pouvez repasser le quiz"}
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                  <Award className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Votre score</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {results.score}/{quiz.points}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                  <CheckCircle className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Pourcentage</p>
                  <p className="text-3xl font-bold text-gray-900">{percentage}%</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                  <Trophy className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">Bonnes réponses</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {results.correctCount}/{quiz.questions.length}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Détail des réponses
                </h2>
                {quiz.questions.map((question, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <QuizQuestions
                      key={index}
                      question={question}
                      questionIndex={index}
                      selectedAnswer={userAnswer}
                      onSelectAnswer={() => {}}
                      showResults={true}
                      isCorrect={isCorrect}
                    />
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Retour au cours
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Repasser le quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 sticky top-4 z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600 text-sm">
                {getAnsweredCount()} / {quiz.questions.length} questions répondues
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
                  timeRemaining < 300
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <Clock
                  className={`w-6 h-6 ${
                    timeRemaining < 300 ? "animate-pulse" : ""
                  }`}
                />
                <div>
                  <p className="text-xs font-semibold">Temps restant</p>
                  <p className="text-2xl font-bold">{formatTime(timeRemaining)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progression</span>
              <span>
                {Math.round((getAnsweredCount() / quiz.questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${(getAnsweredCount() / quiz.questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-6">
          {quiz.questions.map((question, index) => (
            <QuizQuestions
              key={index}
              question={question}
              questionIndex={index}
              selectedAnswer={answers[index]}
              onSelectAnswer={handleSelectAnswer}
              showResults={false}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-bold text-gray-900">
                Prêt à soumettre votre quiz ?
              </p>
              <p className="text-sm text-gray-600">
                Vérifiez vos réponses avant de soumettre
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || getAnsweredCount() === 0}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {submitting ? (
              "Soumission en cours..."
            ) : (
              <>
                <Send className="w-6 h-6" />
                Soumettre le quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;