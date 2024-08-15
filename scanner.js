
const scanner = new Instascan.Scanner({
    video: document.getElementById("camera-preview"),
  });
  const scanResultsTable = document
    .getElementById("scan-results-table")
    .getElementsByTagName("tbody")[0];
  const downloadLink = document.getElementById("download-link");
  const scanSound = document.getElementById("scan-sound"); // Tambahkan ini
  let scanCounter = 1;
  
  scanner.addListener("scan", function (content) {
    document.getElementById("scan-result").textContent = content;
  
    // Menambahkan hasil scan ke dalam tabel
    const newRow = scanResultsTable.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    cell1.textContent = scanCounter;
    cell2.textContent = content;
    scanCounter++;
  
    // Memainkan suara bip
    playScanSound();
  
    // Update dan atur scroll ke bawah
    updateDownloadLink();
  
    const lastRow = scanResultsTable.rows[scanResultsTable.rows.length - 1];
    lastRow.scrollIntoView({ behavior: "smooth", block: "end" });
  });
  
  
  Instascan.Camera.getCameras()
    .then(function (cameras) {
      if (cameras.length > 0) {
        scanner.start(cameras[0]);
      } else {
        console.error("No cameras found.");
      }
    })
    .catch(function (error) {
      console.error("Error accessing cameras:", error);
    });
  
  function updateDownloadLink() {
    let csvContent = "No.,Hasil Scan\n";
  
    for (let i = 0; i < scanResultsTable.rows.length; i++) {
      const row = scanResultsTable.rows[i];
      const scanNumber = row.cells[0].textContent;
      const scanResult = row.cells[1].textContent;
      csvContent += `${scanNumber},${scanResult}\n`;
    }
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.style.display = "block";
    downloadLink.download = "scan_results.csv";
  }
  
  function playScanSound() {
    scanSound.currentTime = 0; // Reset waktu pemutaran
    scanSound.play();
  }
  