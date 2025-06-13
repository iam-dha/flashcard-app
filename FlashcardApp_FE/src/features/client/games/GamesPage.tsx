import WordScramblePage from "./WordScramblePage";

function GameCard({
  title = "Game Title",
  description = "Game description",
  playButton,
}: {
  title?: string;
  description?: string;
  playButton?: React.ReactElement;
}) {
  return (
    <div className="flex h-[200px] w-full flex-col justify-between rounded-lg p-4 shadow transition-shadow hover:shadow-lg">
      <div className="mt-auto flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        {playButton}
      </div>
    </div>
  );
}
export default function GamesPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col">
        <h1 className="pb-6 text-2xl font-bold">Games</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <GameCard
            title="Word Scramble"
            description="Unscramble the letters to form a word. A fun way to test your vocabulary!"
            playButton={<WordScramblePage />}
          />
          {/* <GameCard title="Multiple Choice Quiz" description="Test your knowledge with multiple choice questions on various topics." /> */}
        </div>
      </div>
    </div>
  );
}
