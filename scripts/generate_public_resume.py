from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUTS = (
    ROOT / "assets" / "resume" / "ethan-lawrie-resume.pdf",
    ROOT / "output" / "pdf" / "ethan-lawrie-resume.pdf",
)

TEAL = colors.HexColor("#1C3D46")
CREAM = colors.HexColor("#FDEFD4")
CORAL = colors.HexColor("#FC967D")
CHARCOAL = colors.HexColor("#242322")
MUTED = colors.HexColor("#52666A")
RULE = colors.HexColor("#B9AA91")


def styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=30,
            leading=31,
            textColor=CREAM,
            spaceAfter=3,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.8,
            leading=11.5,
            textColor=CREAM,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13.5,
            leading=15,
            textColor=TEAL,
            spaceBefore=7,
            spaceAfter=3,
        ),
        "title": ParagraphStyle(
            "Title",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=11.2,
            textColor=CHARCOAL,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8.7,
            leading=10.2,
            textColor=MUTED,
        ),
        "date": ParagraphStyle(
            "Date",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=10.2,
            textColor=MUTED,
            alignment=TA_RIGHT,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.4,
            leading=10.2,
            textColor=CHARCOAL,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.25,
            leading=10.15,
            leftIndent=9,
            firstLineIndent=-7,
            textColor=CHARCOAL,
            spaceBefore=1.8,
        ),
        "skills": ParagraphStyle(
            "Skills",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.25,
            leading=10.2,
            textColor=CHARCOAL,
            spaceAfter=1.4,
        ),
    }


def section_heading(label, style):
    table = Table([[Paragraph(label, style)]], colWidths=[None])
    table.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 0), (-1, -1), 0.8, TEAL),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.4),
            ]
        )
    )
    return table


def entry(style, organization, role, location, period, bullets):
    heading = Table(
        [
            [Paragraph(organization, style["title"]), Paragraph(location, style["date"])],
            [Paragraph(role, style["subtitle"]), Paragraph(period, style["date"])],
        ],
        colWidths=[125 * mm, 48 * mm],
    )
    heading.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    content = [heading, Spacer(1, 2)]
    content.extend(Paragraph(f"- {bullet}", style["bullet"]) for bullet in bullets)
    content.append(Spacer(1, 4))
    return KeepTogether(content)


def build_story():
    style = styles()
    story = []

    name = Paragraph("Ethan Lawrie", style["name"])
    links = Paragraph(
        'Adelaide, SA, Australia<br/>'
        '<link href="https://www.linkedin.com/in/ethan-lawrie" color="#FDEFD4">linkedin.com/in/ethan-lawrie</link>'
        '  |  <link href="https://www.ethanlawrie.com" color="#FDEFD4">ethanlawrie.com</link>',
        style["contact"],
    )
    header = Table([[name, links]], colWidths=[91 * mm, 82 * mm])
    header.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), TEAL),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (0, 0), 10),
                ("RIGHTPADDING", (0, 0), (0, 0), 5),
                ("LEFTPADDING", (1, 0), (1, 0), 5),
                ("RIGHTPADDING", (1, 0), (1, 0), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ("BOX", (0, 0), (-1, -1), 1.5, TEAL),
                ("LINEBELOW", (0, 0), (-1, -1), 3, CORAL),
            ]
        )
    )
    story.extend([header, Spacer(1, 5)])

    story.append(section_heading("Education", style["section"]))
    story.append(
        entry(
            style,
            "University of Adelaide",
            "Bachelor of Computer Science (Advanced)(Honours), Major in Artificial Intelligence",
            "Adelaide, SA",
            "2024 - Expected 2027",
            [
                "GPA: 6.5/7.0. Coursework includes Data Structures and Algorithms, Systems Programming, Computer Systems, Object-Oriented Programming, and Software Design."
            ],
        )
    )

    story.append(section_heading("Experience", style["section"]))
    story.append(
        entry(
            style,
            "CMV Group",
            "Data Solutions Engineer",
            "Adelaide, SA",
            "Apr 2024 - Present",
            [
                "Developing an AI document-to-audio workflow that orchestrates content ingestion, LLM summarisation, and text-to-speech generation for concise executive briefings.",
                "Built a retrieval-augmented Outlook email-drafting add-in using prior mailbox context and an Azure Functions backend.",
                "Architected an incident-reporting platform using Plumsail SharePoint forms, JavaScript, Azure Functions REST APIs, SQL Server, and Azure Blob Storage.",
                "Optimised employee share-registry processing through batch execution, increasing efficiency by 1,500%, and developed serverless workflows for automated ATO reporting.",
            ],
        )
    )
    story.append(
        entry(
            style,
            "Microsoft",
            "Software Engineering Intern, Azure Client Tools",
            "Sydney, NSW",
            "Dec 2025 - Feb 2026",
            [
                "Implemented end-to-end OpenTelemetry instrumentation in Python for the Azure CLI AI-assisted command handler.",
                "Captured request latency, token consumption, outcomes, errors, and response-quality signals for reliability, performance, and cost analysis.",
                "Created Grafana dashboards for service health and model-usage trends, supporting bottleneck diagnosis with production telemetry.",
            ],
        )
    )
    story.append(
        entry(
            style,
            "Word Lawrie",
            "Lead Developer and Producer",
            "Adelaide, SA",
            "Jan 2023 - Feb 2024",
            [
                "Led a four-person team to design, build, and release a 2D word game using Unity and C#.",
                "Negotiated a non-exclusive Coolmath Games licence, resulting in a 7,000% increase in monthly active users.",
            ],
        )
    )

    story.append(section_heading("Project", style["section"]))
    story.append(
        entry(
            style,
            "Syntactic",
            "Unity, C#, Azure DevOps",
            "Independent project",
            "2026 - Present",
            [
                "Building a roguelike word-combat game with staged validation, damage previews, enemy intents, data-driven script effects, and a custom retro-terminal interface.",
                "Implemented modular combat state, letter-cache and script-process runtimes, RAM-based resources, and reusable UI components for a vertical-slice prototype.",
            ],
        )
    )

    story.append(section_heading("Competitive Programming and Achievements", style["section"]))
    story.extend(
        [
            Paragraph("- <b>Jane Street ETC (Feb 2025):</b> 2nd overall out of 16 teams.", style["bullet"]),
            Paragraph("- <b>RSP x CPC Competition (Mar 2025):</b> 2nd overall out of 38 teams.", style["bullet"]),
            Paragraph("- <b>Adelaide University Competitive Programming League:</b> 6th overall in the 2025 league.", style["bullet"]),
            Spacer(1, 2),
        ]
    )

    story.append(section_heading("Technical Skills", style["section"]))
    story.extend(
        [
            Paragraph("<b>Languages:</b> Python, C#, C++, JavaScript, SQL, Bash", style["skills"]),
            Paragraph("<b>Cloud and backend:</b> Azure Functions, REST APIs, OpenTelemetry, SQL Server, Azure Blob Storage, SharePoint, Power Platform", style["skills"]),
            Paragraph("<b>AI and developer tools:</b> RAG, LLM application workflows, text-to-speech, Grafana, Git, Azure DevOps, Unity", style["skills"]),
        ]
    )
    return story


def generate(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=14 * mm,
        bottomMargin=12 * mm,
        title="Ethan Lawrie - Public Resume",
        author="Ethan Lawrie",
        subject="Software engineering resume",
    )
    document.build(build_story())


if __name__ == "__main__":
    for output in OUTPUTS:
        generate(output)
        print(output)
