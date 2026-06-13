import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generate cricket match scorecard PDF
 */
export const generateMatchPDF = (match) => {
  if (!match) {
    throw new Error("Match data is required");
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Colors
  const colors = {
    primary: [26, 122, 74],
    darkGreen: [15, 81, 50],
    red: [220, 38, 38],
    blue: [37, 99, 235],
    purple: [124, 58, 237],
    amber: [245, 158, 11],
    gray: [107, 114, 128],
    lightGray: [243, 244, 246],
    dark: [31, 41, 55],
    white: [255, 255, 255],
  };

  let yPos = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // ===== HEADER =====
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setFontSize(24);
  doc.setTextColor(...colors.white);
  doc.text("🏏", margin, 22);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("GULLY CRICKET", margin + 12, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Live Score Tracker - Match Scorecard", margin + 12, 25);

  doc.setFontSize(9);
  const matchDate = match.matchDate
    ? new Date(match.matchDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";
  doc.text(matchDate, pageWidth - margin, 18, { align: "right" });
  doc.setFontSize(8);
  doc.text(
    `Match ID: ${match._id?.substring(0, 8)}...`,
    pageWidth - margin,
    24,
    { align: "right" }
  );

  yPos = 45;

  // ===== MATCH TITLE =====
  doc.setTextColor(...colors.dark);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(match.title || "Match", pageWidth / 2, yPos, { align: "center" });

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.gray);
  doc.text(
    `${match.groundName || "Ground"} | ${match.totalOvers || 0} Overs Match`,
    pageWidth / 2,
    yPos,
    { align: "center" }
  );

  yPos += 10;

  // ===== TEAMS HEADER =====
  doc.setFillColor(...colors.lightGray);
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 25, 3, 3, "F");

  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(match.teamA?.name || "Team A", margin + 5, yPos + 10);

  doc.text(match.teamB?.name || "Team B", pageWidth - margin - 5, yPos + 10, {
    align: "right",
  });

  doc.setTextColor(...colors.primary);
  doc.setFontSize(12);
  doc.text("VS", pageWidth / 2, yPos + 10, { align: "center" });

  doc.setTextColor(...colors.gray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  const tossText = `${
    match.toss?.winner || "N/A"
  } won the toss and elected to ${match.toss?.decision || "bat"} first`;
  doc.text(tossText, pageWidth / 2, yPos + 18, { align: "center" });

  yPos += 32;

  // ===== MATCH RESULT BANNER =====
  if (match.status === "completed" && match.result?.description) {
    doc.setFillColor(...colors.primary);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 18, 3, 3, "F");

    doc.setTextColor(...colors.white);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`WINNER: ${match.result.description}`, pageWidth / 2, yPos + 8, {
      align: "center",
    });

    if (match.result.manOfTheMatch?.playerName) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Man of the Match: ${match.result.manOfTheMatch.playerName}`,
        pageWidth / 2,
        yPos + 14,
        { align: "center" }
      );
    }

    yPos += 25;
  }

  // ===== INNINGS DATA =====
  const innings = match.innings || [];

  innings.forEach((inning, inningIndex) => {
    // Check if new page needed
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    // Innings Header
    doc.setFillColor(...colors.darkGreen);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 10, 2, 2, "F");

    doc.setTextColor(...colors.white);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${inningIndex === 0 ? "1st" : "2nd"} INNINGS - ${
        inning.battingTeamName || "Team"
      }`,
      margin + 3,
      yPos + 6.5
    );

    const scoreText = `${inning.totalRuns}/${inning.wickets} (${
      inning.oversCompleted
    }.${inning.ballsInCurrentOver || 0} ov)`;
    doc.text(scoreText, pageWidth - margin - 3, yPos + 6.5, {
      align: "right",
    });

    yPos += 13;

    // Run rate info
    const runRate =
      inning.oversCompleted * 6 + (inning.ballsInCurrentOver || 0) > 0
        ? (
            (inning.totalRuns /
              (inning.oversCompleted * 6 + (inning.ballsInCurrentOver || 0))) *
            6
          ).toFixed(2)
        : "0.00";

    doc.setTextColor(...colors.gray);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Run Rate: ${runRate}${
        inning.target ? ` | Target: ${inning.target}` : ""
      }`,
      margin,
      yPos
    );

    yPos += 5;

    // ===== BATTING TABLE =====
    const batters = (inning.batters || []).filter(
      (b) => b.status !== "yet_to_bat"
    );

    if (batters.length > 0) {
      const battingData = batters.map((b) => [
        b.playerName || "Unknown",
        b.status === "batting" ? "not out" : b.dismissalInfo || "out",
        b.runs.toString(),
        b.balls.toString(),
        b.fours.toString(),
        b.sixes.toString(),
        b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(2) : "0.00",
      ]);

      // ✅ FIXED: Use autoTable as function, not method
      autoTable(doc, {
        startY: yPos,
        head: [["Batter", "Dismissal", "R", "B", "4s", "6s", "SR"]],
        body: battingData,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          textColor: colors.dark,
        },
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontSize: 9,
          fontStyle: "bold",
          halign: "left",
        },
        columnStyles: {
          0: { cellWidth: 35, fontStyle: "bold" },
          1: { cellWidth: 50, fontSize: 7, textColor: colors.gray },
          2: { halign: "right", fontStyle: "bold", cellWidth: 12 },
          3: { halign: "right", cellWidth: 12 },
          4: { halign: "right", cellWidth: 12, textColor: colors.blue },
          5: { halign: "right", cellWidth: 12, textColor: colors.purple },
          6: { halign: "right", cellWidth: 18, textColor: colors.amber },
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
      });

      // ✅ FIXED: Get finalY from the lastAutoTable property
      yPos = doc.lastAutoTable.finalY + 3;
    }

    // Yet to bat
    const yetToBat = (inning.batters || []).filter(
      (b) => b.status === "yet_to_bat"
    );
    if (yetToBat.length > 0) {
      doc.setTextColor(...colors.gray);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      const names = yetToBat.map((b) => b.playerName).join(", ");
      doc.text(`Yet to bat: ${names}`, margin, yPos);
      yPos += 5;
    }

    // Extras
    if (inning.extras) {
      doc.setTextColor(...colors.gray);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Extras: ${inning.extras.total || 0} (wd ${
          inning.extras.wides || 0
        }, nb ${inning.extras.noBalls || 0}, b ${inning.extras.byes || 0}, lb ${
          inning.extras.legByes || 0
        })`,
        margin,
        yPos
      );
      yPos += 6;
    }

    // ===== BOWLING TABLE =====
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    const bowlers = inning.bowlers || [];
    if (bowlers.length > 0) {
      const bowlingData = bowlers.map((b) => {
        const totalBalls = b.overs * 6 + (b.balls || 0);
        const economy =
          totalBalls > 0 ? ((b.runs / totalBalls) * 6).toFixed(2) : "0.00";
        return [
          b.playerName || "Unknown",
          `${b.overs}.${b.balls || 0}`,
          b.maidens.toString(),
          b.runs.toString(),
          b.wickets.toString(),
          economy,
        ];
      });

      // ✅ FIXED: Use autoTable as function
      autoTable(doc, {
        startY: yPos,
        head: [["Bowler", "O", "M", "R", "W", "Eco"]],
        body: bowlingData,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          textColor: colors.dark,
        },
        headStyles: {
          fillColor: colors.red,
          textColor: colors.white,
          fontSize: 9,
          fontStyle: "bold",
          halign: "left",
        },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: "bold" },
          1: { halign: "right", cellWidth: 18 },
          2: { halign: "right", cellWidth: 18 },
          3: { halign: "right", cellWidth: 18, textColor: colors.amber },
          4: {
            halign: "right",
            cellWidth: 18,
            textColor: colors.red,
            fontStyle: "bold",
          },
          5: { halign: "right", cellWidth: 22 },
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
      });

      yPos = doc.lastAutoTable.finalY + 8;
    }
  });

  // ===== FOOTER =====
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const footerY = doc.internal.pageSize.getHeight() - 10;

    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFontSize(7);
    doc.setTextColor(...colors.gray);
    doc.setFont("helvetica", "italic");
    doc.text(
      `Generated on ${new Date().toLocaleString(
        "en-IN"
      )} | Gully Cricket Live Score Tracker`,
      margin,
      footerY
    );

    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, footerY, {
      align: "right",
    });
  }

  // ===== SAVE PDF =====
  const fileName = `${match.title || "Match"}_Scorecard_${
    new Date().toISOString().split("T")[0]
  }.pdf`;

  // Clean filename (remove special chars)
  const cleanFileName = fileName.replace(/[^a-z0-9_\-.]/gi, "_");

  doc.save(cleanFileName);

  return cleanFileName;
};

/**
 * Generate live scorecard PDF (for ongoing matches)
 */
export const generateLiveScorecardPDF = (match, liveScore) => {
  if (!match) {
    throw new Error("Match data is required");
  }

  const doc = new jsPDF();

  // Header
  doc.setFillColor(26, 122, 74);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("LIVE MATCH SCORECARD", 14, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    doc.internal.pageSize.getWidth() - 14,
    18,
    { align: "right" }
  );

  let y = 40;

  // Match Info
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(match.title, doc.internal.pageSize.getWidth() / 2, y, {
    align: "center",
  });

  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${match.groundName} | ${match.totalOvers} Overs Match`,
    doc.internal.pageSize.getWidth() / 2,
    y,
    { align: "center" }
  );

  y += 15;

  // Current Innings
  if (liveScore?.currentInnings) {
    const ci = liveScore.currentInnings;

    doc.setFillColor(26, 122, 74);
    doc.roundedRect(
      14,
      y,
      doc.internal.pageSize.getWidth() - 28,
      25,
      3,
      3,
      "F"
    );

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${ci.battingTeam} - Batting`, 18, y + 8);

    doc.setFontSize(20);
    doc.text(`${ci.totalRuns}/${ci.wickets}`, 18, y + 19);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`(${ci.overs} ov)`, 55, y + 19);

    doc.setFontSize(9);
    doc.text(
      `RR: ${ci.runRate || 0}`,
      doc.internal.pageSize.getWidth() - 18,
      y + 12,
      { align: "right" }
    );

    if (ci.target) {
      doc.text(
        `Target: ${ci.target} | Need: ${ci.requiredRuns}`,
        doc.internal.pageSize.getWidth() - 18,
        y + 19,
        { align: "right" }
      );
    }

    y += 32;
  }

  // Save
  const fileName = `${match.title}_Live_${Date.now()}.pdf`.replace(
    /[^a-z0-9_\-.]/gi,
    "_"
  );
  doc.save(fileName);
};

export default { generateMatchPDF, generateLiveScorecardPDF };
