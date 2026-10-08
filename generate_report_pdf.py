from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem, Preformatted

OUTPUT = "project-report.pdf"

content = [
    "Money Matters - Project Report",
    "",
    "1. Project Title",
    "Money Matters - Frontend Financial Dashboard",
    "",
    "2. Introduction",
    "This project is a responsive personal finance and accounting web application developed using React, HTML, and CSS. It allows users to manage their personal financial transactions, monitor inflow and outflow of money, and keep track of their financial status through a dashboard interface. The application also includes role-based authentication, user profile management, and transaction operations.",
    "",
    "3. Objective",
    "The objective of this project is to build a modern and user-friendly frontend application that helps users:",
    "- Track daily transactions",
    "- View total credit and debit summaries",
    "- Analyze weekly financial trends",
    "- Add, edit, and delete transactions",
    "- Manage a user profile",
    "- Access the application through secure login protection",
    "",
    "4. Problem Statement",
    "Managing personal finance manually is often time-consuming and error-prone. Users require an application that provides a clear summary of their financial state and allows them to quickly update and track transactions without dealing with complex paperwork or spreadsheets.",
    "",
    "5. Scope of the Project",
    "The project includes:",
    "- User authentication",
    "- Protected routing",
    "- Dashboard summaries",
    "- Recent transactions table",
    "- Credit and debit filtering",
    "- Financial chart visualization",
    "- Add, update, and delete transaction management",
    "- Responsive frontend design",
    "",
    "6. Technology Stack",
    "- React.js",
    "- HTML5",
    "- CSS3",
    "- Vite",
    "- React Router DOM",
    "- Recharts",
    "- Lucide React",
    "- Date-fns",
    "- JS-Cookie",
    "- Hasura Cloud REST APIs",
    "",
    "7. Features",
    "Authentication",
    "- Login with user credentials",
    "- Admin and standard user roles",
    "- Session persistence using cookies",
    "- Protected routes",
    "Dashboard",
    "- Total credit summary card",
    "- Total debit summary card",
    "- Recent transactions section",
    "- Weekly transaction chart",
    "Transactions",
    "- View all transactions",
    "- Filter credit/debit transactions",
    "- Add new transaction",
    "- Edit transaction details",
    "- Delete transaction with confirmation",
    "- Pagination control",
    "Profile",
    "- User profile display",
    "- Edit profile information",
    "- Role label and user information display",
    "UI/UX",
    "- Responsive layout",
    "- Clean and modern interface",
    "- Modular component design",
    "- Loading, success, and error states",
    "",
    "8. Project Structure",
    "The project is organized into multiple folders for separation of concerns, including:",
    "- src/pages",
    "- src/components",
    "- src/context",
    "- src/services",
    "- src/routes",
    "- src/layout",
    "- src/assets",
    "- src/constants",
    "",
    "9. User Profile and Backend Security",
    "Standard User username: praneeth07 | Email: kotalapraneeth07@gmail.com",
    "Passwords and backend secrets are not stored in the repository.",
    "Configure Hasura access through trusted server-side authentication or JWT role authorization; do not expose an admin secret in browser code.",
    "",
    "10. Setup Instructions",
    "To run the project locally:",
    "1. cd \"C:\\Users\\HP\\OneDrive\\Desktop\\frontendProject\"",
    "2. npm install",
    "3. npm run dev -- --host 0.0.0.0",
    "Then open http://localhost:5173/",
    "",
    "11. Production Build",
    "npm run build",
    "",
    "12. Conclusion",
    "Money Matters is a complete frontend financial management system focused on usability, responsiveness, and real-time transaction tracking. It demonstrates modern React-based frontend development with a clean dashboard, secure authentication flow, and efficient transaction management features.",
    "This project provides a practical solution for users who want to monitor and manage their personal finances in a simple and effective manner.",
]

styles = getSampleStyleSheet()
normal = styles["Normal"]
heading1 = styles["Heading1"]
heading2 = styles["Heading2"]
heading3 = styles["Heading3"]
normal.fontName = 'Helvetica'
normal.fontSize = 10
heading1.fontName = 'Helvetica-Bold'
heading1.fontSize = 22
heading1.leading = 26
heading2.fontName = 'Helvetica-Bold'
heading2.fontSize = 14
heading2.leading = 18
heading3.fontName = 'Helvetica-Bold'
heading3.fontSize = 12
heading3.leading = 16

story = []

for item in content:
    if item == "":
        story.append(Spacer(1, 8))
        continue
    if item.startswith("#"):
        continue
    if item.startswith("- "):
        story.append(ListFlowable([
            ListItem(Paragraph(item[2:], normal), bulletType='bullet', bulletColor=colors.black)
        ], bulletType='bullet'))
        continue
    if item.startswith("1.") or item.startswith("2.") or item.startswith("3.") or item.startswith("4.") or item.startswith("5.") or item.startswith("6.") or item.startswith("7.") or item.startswith("8.") or item.startswith("9.") or item.startswith("10.") or item.startswith("11.") or item.startswith("12."):
        story.append(Paragraph(item, heading2))
        continue
    if item in ["Authentication", "Dashboard", "Transactions", "Profile", "UI/UX"]:
        story.append(Paragraph(item, heading3))
        continue
    story.append(Paragraph(item, normal))

# Ensure title is styled first
story.insert(0, Paragraph("Money Matters - Project Report", heading1))

pdf = SimpleDocTemplate(OUTPUT, pagesize=A4, leftMargin=50, rightMargin=50, topMargin=40, bottomMargin=40)
pdf.build(story)
print(f"Generated PDF: {OUTPUT}")
