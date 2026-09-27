from pathlib import Path
from shutil import copyfile

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
INK = TEAL
MUTED = colors.HexColor("#405F63")
RULE = colors.HexColor("#91C3CE")


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
            fontSize=9.2,
            leading=12,
            textColor=CREAM,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=15.5,
            textColor=TEAL,
            spaceBefore=8,
            spaceAfter=3.5,
        ),
        "title": ParagraphStyle(
            "Title",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.4,
            leading=11.8,
            textColor=INK,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=9.1,
            leading=10.8,
            textColor=MUTED,
        ),
        "date": ParagraphStyle(
            "Date",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.9,
            leading=10.8,
            textColor=MUTED,
            alignment=TA_RIGHT,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.9,
            leading=10.8,
            textColor=INK,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.75,
            leading=10.8,
            leftIndent=9,
            firstLineIndent=-7,
            textColor=INK,
            spaceBefore=2,
        ),
        "skills": ParagraphStyle(
            "Skills",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.7,
            leading=10.8,
            textColor=INK,
            spaceAfter=1.6,
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
    content = [heading, Spacer(1, 2.5)]
    content.extend(Paragraph(f"- {bullet}", style["bullet"]) for bullet in bullets)
    content.append(Spacer(1, 5))
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

    story.append(section_heading("Experience", style["section"]))
    story.append(
        entry(
            style,
            "CMV Group",
            "Data Solutions Engineer",
            "Adelaide, SA",
            "Apr 2024 - Present",
            [
                "Design and build operational software, cloud applications, and data workflows using Azure and web technologies.",
                "Designed the architecture for an incident-reporting platform. The platform has reached user acceptance testing as of September 2026.",
                "Developed AI-assisted tools and business workflow automation, with a focus on useful interfaces and reliable data handling.",
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
                "Implemented telemetry for Azure CLI Copilot using Python and OpenTelemetry, and built dashboards in Grafana.",
                "Contributed implementation, review, and testing for observability tooling. The work reached user acceptance testing by the end of my internship in February 2026.",
            ],
        )
    )

    story.append(section_heading("Education", style["section"]))
    story.append(
        entry(
            style,
            "Adelaide University",
            "Bachelor of Computer Science (Advanced), Major in Artificial Intelligence",
            "Adelaide, SA",
            "In progress",
            [
                "GPA: 6.5/7.0. Selected coursework: Data Structures and Algorithms, Systems Programming, Cloud Computing, Computer Systems, Software Design, Operating Systems, and Machine Learning."
            ],
        )
    )

    story.append(section_heading("Projects", style["section"]))
    story.append(
        entry(
            style,
            "Word Lawrie",
            "Team project - Unity, C#",
            "Four-person team",
            "2023 - 2024",
            [
                "Led development and shipped a word game across mobile and web, owning core gameplay, UX iteration, testing, and release.",
                "Secured distribution through Coolmath Games, bringing the game to browser players alongside its mobile release.",
            ],
        )
    )
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
    generate(OUTPUTS[0])
    print(OUTPUTS[0])
    for output in OUTPUTS[1:]:
        output.parent.mkdir(parents=True, exist_ok=True)
        copyfile(OUTPUTS[0], output)
        print(output)
