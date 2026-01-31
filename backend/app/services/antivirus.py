import subprocess
import time

def scan_file(file_path: str) -> bool:
    """
    Scan a file using ClamAV (clamscan CLI).

    Args:
        file_path (str): Path to the file to scan.

    Returns:
        bool: True if file is clean, False if infected.

    Raises:
        RuntimeError: If ClamAV fails unexpectedly (non-0/1 return code or subprocess error).
    """
    try:
        start_time = time.time()
        print(f"Starting ClamAV scan for: {file_path}")

        result = subprocess.run(
            ["clamscan", "--no-summary", file_path],
            capture_output=True,
            text=True,
            check=False
        )

        elapsed = time.time() - start_time
        print(f"ClamAV scan completed in {elapsed:.2f} seconds.")

        if result.returncode == 0:
            print("File is clean.")
            return True
        elif result.returncode == 1:
            print("File is infected.")
            return False
        else:
            error_detail = result.stderr.strip() or result.stdout.strip()
            raise RuntimeError(f"ClamAV error ({result.returncode}): {error_detail}")

    except Exception as e:
        raise RuntimeError(f"Virus scan failed: {str(e)}")
