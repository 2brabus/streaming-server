async function displayDiagramData() {
  const outputElement = document.getElementById('diagram-data-output');
  if (!outputElement) {
    console.error("Element #diagram-data-output nie znaleziony.");
    return;
  }

  try {
    // In AI Studio, paths are typically relative to the project root.
    const response = await fetch('/sample-diagram.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}. Nie udało się pobrać pliku /sample-diagram.json.`);
    }
    const diagramData = await response.json();
    outputElement.textContent = JSON.stringify(diagramData, null, 2);
  } catch (error) {
    console.error('Błąd podczas ładowania lub wyświetlania danych diagramu:', error);
    outputElement.textContent = `Wystąpił błąd podczas ładowania danych diagramu:\n${(error as Error).message}\n\nUpewnij się, że plik sample-diagram.json istnieje w katalogu /streaming-diagram-server/ i jest poprawnym JSON-em.`;
    outputElement.style.color = '#ff6666'; // Red color for error message
  }
}

// Call the function when the script loads
displayDiagramData();
