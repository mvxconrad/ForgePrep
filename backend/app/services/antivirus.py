import subprocess

def scan_file(file_path: str) -> bool:
    """
    Scans a file using ClamAV (clamscan command-line tool).
    Returns True if the file is clean, False if infected.
    Raises an exception if scanning fails.
    """
    try:
        result = subprocess.run(
            ["clamscan", "--no-summary", file_path],
            capture_output=True,
            text=True,
            check=False  # Don't raise exception on non-zero return codes
        )

        if result.returncode not in [0, 1]:  # 0 = clean, 1 = infected
            raise RuntimeError(f"ClamAV failed: {result.stderr.strip()}")

        return "Infected files: 0" in result.stdout

    except Exception as e:
        raise RuntimeError(f"Virus scan error: {str(e)}")
