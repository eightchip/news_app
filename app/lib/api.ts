import { cookies } from 'next/headers';

export async function getWordLists() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wordlists`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch word lists');
  }

  const data = await response.json();
  return data.filter((wordList: any) => wordList.words && wordList.words.length > 0);
}