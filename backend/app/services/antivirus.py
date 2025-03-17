# Description: Service to scan files using ClamAV.
# The service scans a file using ClamAV and returns True if the file is clean.

import subprocess

def scan_file(file_path: str) -> bool:
    """Scans a file using ClamAV and returns True if clean."""
    result = subprocess.run(["clamscan", file_path], capture_output=True, text=True)
    return "Infected files: 0" in result.stdout  # True if clean, False if infected
