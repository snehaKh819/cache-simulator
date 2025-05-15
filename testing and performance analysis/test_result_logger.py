# test_result_logger.py
import csv
import subprocess
import json
import tempfile
import os
import random
import json

# Load test cases from the JSON file
with open("testing and performance analysis/test_cases.json", "r") as file:
    test_cases = json.load(file)

# Output CSV file
csv_filename = "testing and performance analysis/test_results.csv"

# Determine the executable name based on the OS
executable = "cache_sim_backend/core cache engine/cache_engine.exe" if os.name == "nt" else "./cache_engine"

with open(csv_filename, mode='w', newline='') as csv_file:
    fieldnames = ['Test Name', 'Hits', 'Misses', 'Collisions', 'Load Factor']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()

    for test_name, keys in test_cases.items():
        try:
            # Handle large inputs by writing keys to a temporary file
            if len(keys) > 1000:  # Threshold for large inputs
                with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
                    temp_file.write("\n".join(map(str, keys)))
                    temp_file_name = temp_file.name

                # Run cache engine with the temporary file
                result = subprocess.run([executable, temp_file_name], capture_output=True, text=True, check=True)

                # Clean up the temporary file
                os.remove(temp_file_name)
            else:
                # Run cache engine with keys directly as arguments
                keys_as_str = list(map(str, keys))
                result = subprocess.run([executable, *keys_as_str], capture_output=True, text=True, check=True)

            # Parse and log the output
            output = json.loads(result.stdout.strip())
            writer.writerow({
                'Test Name': test_name,
                'Hits': output.get("hits", 0),
                'Misses': output.get("misses", 0),
                'Collisions': output.get("collisions", 0),
                'Load Factor': output.get("load_factor", 0.0)
            })
            print(f"Logged result for: {test_name}")

        except subprocess.CalledProcessError as e:
            print(f"Error running cache engine for {test_name}:", e)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON output for {test_name}:", e)

print("\nAll test results logged to", csv_filename)

import pandas as pd

# Generate a summary
df = pd.read_csv(csv_filename)
print("\nSummary of Results:")
print(df.describe())

# Optional: Generate a bar chart
# df.plot(x='Test Name', y=['Hits', 'Misses', 'Collisions'], kind='bar')