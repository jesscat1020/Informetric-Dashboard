const batchList = [
  "TK1001_17JUN21",  "TK1001_17JUN21RUN2",  "20210625.130024",  "20210713.151233",  "20210716.144512",  "20210720.112024"
];

document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("batchDropdown");
  const content = document.getElementById("reportContent");

  // Populate dropdown
  batchList.forEach(batch => {
    const option = document.createElement("option");
    option.value = batch;
    option.textContent = batch;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener("change", function () {
    const selectedBatch = dropdown.value;
    if (!selectedBatch) {
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📊</div>
          <h3>Welcome to Batch Analytics</h3>
          <p>Select a batch from the dropdown above to view detailed analysis.</p>
          <p><strong>Available Batches:</strong> 6</p>
        </div>`;
      return;
    }

    // Show loading state
    content.innerHTML = `
      <div class="loading-state">
        <div class="loading-icon">⏳</div>
        <h3>Loading Batch Report...</h3>
        <p>Please wait while we load the detailed report for {selectedBatch}.</p>
      </div>`;

    // Load the batch report
    fetch(`batch_reports/${selectedBatch}.html`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(html => {
        // Extract just the content inside the container
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const container = doc.querySelector('.container');
        if (container) {
          content.innerHTML = container.innerHTML;
        } else {
          content.innerHTML = html;
        }
      })
      .catch(err => {
        console.error('Error loading batch report:', err);
        content.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">❌</div>
            <h3>Error Loading Report</h3>
            <p>Could not load the batch report for <strong>${selectedBatch}</strong></p>
            <p>Error: ${err.message}</p>
            <p>Please check that the file exists in the batch_reports/ directory.</p>
          </div>`;
      });
  });
});