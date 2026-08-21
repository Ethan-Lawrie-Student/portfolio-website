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
        'Adelaide, SA, Australia  |  Australian citizen<br/>'
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
            "Adelaide University",
            "Bachelor of Computer Science (Advanced), Major in Artificial Intelligence",
            "Adelaide, SA",
            "Current",
            [
                "GPA: 6.5/7.0. Selected coursework: Data Structures and Algorithms, Systems Programming, Cloud Computing, Computer Systems, Software Design, Operating Systems, and Machine Learning."
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
                "Built and deployed an Azure document-to-audio workflow using Azure AI Document Intelligence, LLM summarisation, text-to-speech, and WAV chunking for documents hundreds of pages long, including outputs over two hours.",
                "Prototyped a retrieval-augmented Outlook add-in that retrieves prior email context and drafts replies through an Azure Functions backend.",
                "Architected a responsive incident-reporting platform for a planned rollout to 2,000+ employees using SharePoint/Plumsail, JavaScript, Azure Functions, SQL Server, and Azure Blob Storage.",
                "Automated employee share-statement generation, reducing a day-plus manual process to a batch workflow; also built serverless workflows for ATO reporting and operational data capture.",
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
                "Implemented end-to-end telemetry for the Azure CLI Copilot handler with Python and OpenTelemetry, tracing command workflows across multiple AI tool handlers.",
                "Defined telemetry for latency, token usage, errors, handler outcomes, and response-quality signals, then released the changes to UAT through pull-request review and CI.",
                "Built a unified, filterable Grafana dashboard across environments and deployments for reliability, performance, and cost analysis; also contributed an Ev2 deployment script fix.",
            ],
        )
    )

    story.append(section_heading("Projects", style["section"]))
    story.append(
        entry(
            style,
            "Syntactic",
            "Unity, C#, Azure DevOps",
            "Independent project",
            "2026 - Present",
            [
                "Building a roguelike word-combat game with persistent letter management, score-based combat, enemy intents, and a custom retro-terminal interface.",
                "Designed data-driven combat state, script-slot and RAM-resource systems, plus reusable UI components for a vertical-slice build.",
            ],
        )
    )
    story.append(
        entry(
            style,
            "Word Lawrie",
            "Team project - Unity, C#",
            "Four-person team",
            "2023 - 2024",
            [
                "Led development and shipped a word game across mobile and web, owning core gameplay, UX iteration, testing, and release.",
                "Negotiated a paid, non-exclusive Coolmath Games distribution licence; the published game held a 4.2/5 rating from 839 votes.",
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
            Paragraph("<b>Cloud and backend:</b> Azure Functions, REST APIs, OpenTelemetry, SQL Server, Azure Blob Storage, Azure AI Document Intelligence", style["skills"]),
            Paragraph("<b>AI applications:</b> Retrieval-augmented generation (RAG), LLM workflows, text-to-speech", style["skills"]),
            Paragraph("<b>Tools and platforms:</b> Git, Azure DevOps, Grafana, Unity, SharePoint, Power Platform, Linux (working knowledge)", style["skills"]),
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
