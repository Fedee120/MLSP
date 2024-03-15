import csv

# Input TSV file path (the file you uploaded)
input_file_path = '/home/spoturno/Downloads/multilex_trial_en_lcp.tsv'

# Output CSV file path
output_file_path = input_file_path.replace('.tsv', '.csv')

# Reading the TSV file and writing to a CSV file
with open(input_file_path, mode='r', encoding='utf-8') as infile, \
     open(output_file_path, mode='w', encoding='utf-8', newline='') as outfile:
    tsv_reader = csv.reader(infile, delimiter='\t')
    csv_writer = csv.writer(outfile)
    
    for row in tsv_reader:
        csv_writer.writerow(row)

print(f"Converted TSV to CSV. The new file is located at: {output_file_path}")

