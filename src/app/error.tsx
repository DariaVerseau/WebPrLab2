'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error(error), [error]);

  return (
    <div className="container py-10 text-center">
      <h2 className="text-xl font-bold text-red-600">Произошла ошибка</h2>
      <p>{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Попробовать снова
      </button>
    </div>
  );
}