import sys
import PyPDF2

try:
    with open('D:/bundles/ecommerce.pdf', 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        with open('parsed_pdf.txt', 'w', encoding='utf-8') as out:
            out.write(text)
except Exception as e:
    print(f"Error reading PDF: {e}")
