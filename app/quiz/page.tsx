import { QuizBuilder } from "@/components/QuizBuilder";

export const metadata = {
  title: "Quiz",
  description:
    "Compose ton QCM : choisis les modules et le nombre de questions, puis lance le quiz.",
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3.5">
        <h1 className="text-base font-medium">Quiz</h1>
        <p className="mt-1 text-sm text-muted">
          Choisis les modules et le nombre de questions, puis lance-toi.
        </p>
      </div>
      <QuizBuilder />
    </div>
  );
}
