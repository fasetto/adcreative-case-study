export default function highlightSearchTerm(searchTerm: string, text: string) {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");

  return text.replace(regex, "<strong>$1</strong>");
}
