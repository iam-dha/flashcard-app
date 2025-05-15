function SearchTips() {
  return (
    <div className="mt-8 rounded-2xl bg-neutral-100 p-8 dark:bg-neutral-900">
      <h2 className="mb-4 text-lg font-semibold">Search Tips</h2>
      <ul className="list-inside list-disc space-y-2 text-neutral-600 dark:text-neutral-400">
        <li>Search for words in either English or Vietnamese</li>
        <li>For more accurate results, use complete words </li>
        <li>Try searching for basic forms of words (e.g., "run" instead of "running")</li>
        <li>If you don't find what you're looking for, try a simpler synonym </li>
      </ul>
    </div>
  );
}

function SearchNextSteps() {
  return (
    <div className="mt-8 rounded-2xl bg-neutral-100 p-8 dark:bg-neutral-900">
      <h2 className="mb-4 text-lg font-semibold">What to do next?</h2>
      <ul className="list-inside list-disc space-y-2 text-neutral-600 dark:text-neutral-400">
        <li>Save your favorite words for later</li>
        <li>Practice with flashcards</li>
        <li>Explore related words and phrases</li>
        <li>Check out other features</li>
      </ul>
    </div>
  );
}

export { SearchTips, SearchNextSteps };
