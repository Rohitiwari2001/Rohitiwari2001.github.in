
document.getElementById('simulate').addEventListener('click', function () {
    const frameCount = parseInt(document.getElementById('frames').value);
    const pages = document.getElementById('pages').value.split(',').map(Number);
    const algorithm = document.getElementById('algorithm').value;

    const outputLines = simulateMemoryManagement(frameCount, pages, algorithm);

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    outputLines.forEach((line, index) => {
        const lineElement = document.createElement('div');
        lineElement.classList.add('line');
        lineElement.style.setProperty('--delay', `${index * 0.1}s`);
        lineElement.textContent = line;
        outputDiv.appendChild(lineElement);
    });
});

function simulateMemoryManagement(frameCount, pages, algorithm) {
    let memory = [];
    let pageFaults = 0;
    let pageHits = 0;
    let outputLines = [];

    pages.forEach(page => {
        if (memory.includes(page)) {
            pageHits++;
            outputLines.push(`Page ${page} hit!`);
            if (algorithm === 'LRU') {
                memory.splice(memory.indexOf(page), 1);
                memory.push(page);
            }
        } else {
            pageFaults++;
            outputLines.push(`Page ${page} fault!`);

            if (memory.length < frameCount) {
                memory.push(page);
            } else {
                if (algorithm === 'FIFO') {
                    const evicted = memory.shift();
                    outputLines.push(`Evicting page ${evicted} from memory.`);
                    memory.push(page);
                } else if (algorithm === 'LRU') {
                    const evicted = memory[0];
                    outputLines.push(`Evicting page ${evicted} from memory.`);
                    memory.splice(0, 1);
                    memory.push(page);
                }
            }
        }
        outputLines.push(`Current Physical Memory: [${memory.join(', ')}]`);
    });

    const pageFaultRate = ((pageFaults / pages.length) * 100).toFixed(2);
    outputLines.push(`Total Page Faults: ${pageFaults}`);
    outputLines.push(`Total Page Hits: ${pageHits}`);
    outputLines.push(`Page Fault Rate: ${pageFaultRate}%`);

    return outputLines;
}
